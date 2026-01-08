<?php
/**
 * Plugin Name: Salary Guide Chatbot Logs
 * Description: Stores chat logs from the Salary Guide Chatbot
 * Version: 1.0.0
 * Author: Uplers
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Create database table on plugin activation
register_activation_hook(__FILE__, 'sgcl_create_table');

function sgcl_create_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'chatbot_logs';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        session_id varchar(100) NOT NULL,
        user_message text NOT NULL,
        bot_response text NOT NULL,
        was_answered tinyint(1) DEFAULT 1,
        category varchar(50) DEFAULT 'general',
        page varchar(255) DEFAULT '',
        user_agent text,
        currency varchar(10) DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY session_id (session_id),
        KEY category (category),
        KEY was_answered (was_answered),
        KEY created_at (created_at)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// Register REST API endpoint
add_action('rest_api_init', function () {
    // Endpoint to receive chat logs
    register_rest_route('chatbot/v1', '/logs', array(
        'methods' => 'POST',
        'callback' => 'sgcl_save_log',
        'permission_callback' => 'sgcl_verify_request',
    ));

    // Endpoint to get chat logs (for admin)
    register_rest_route('chatbot/v1', '/logs', array(
        'methods' => 'GET',
        'callback' => 'sgcl_get_logs',
        'permission_callback' => 'sgcl_verify_admin',
    ));

    // Endpoint to get analytics summary
    register_rest_route('chatbot/v1', '/analytics', array(
        'methods' => 'GET',
        'callback' => 'sgcl_get_analytics',
        'permission_callback' => 'sgcl_verify_admin',
    ));
});

// Verify incoming requests (you can add API key verification here)
function sgcl_verify_request($request) {
    // Option 1: Allow all requests (not recommended for production)
    // return true;

    // Option 2: Verify API key from header
    $api_key = $request->get_header('X-API-Key');
    $valid_key = get_option('sgcl_api_key', '');
    
    if (empty($valid_key)) {
        // If no key is set, allow requests (for initial setup)
        return true;
    }
    
    return $api_key === $valid_key;
}

// Verify admin access
function sgcl_verify_admin($request) {
    return current_user_can('manage_options');
}

// Save chat log
function sgcl_save_log($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'chatbot_logs';

    $params = $request->get_json_params();

    $session_id = sanitize_text_field($params['sessionId'] ?? '');
    $user_message = sanitize_textarea_field($params['userMessage'] ?? '');
    $bot_response = sanitize_textarea_field($params['botResponse'] ?? '');
    $was_answered = isset($params['wasAnswered']) ? (bool) $params['wasAnswered'] : true;
    $category = sanitize_text_field($params['category'] ?? 'general');
    $page = sanitize_text_field($params['page'] ?? '');
    $user_agent = sanitize_textarea_field($params['userAgent'] ?? '');
    $currency = sanitize_text_field($params['currency'] ?? '');

    if (empty($session_id) || empty($user_message)) {
        return new WP_Error('missing_data', 'Missing required fields', array('status' => 400));
    }

    $result = $wpdb->insert(
        $table_name,
        array(
            'session_id' => $session_id,
            'user_message' => $user_message,
            'bot_response' => $bot_response,
            'was_answered' => $was_answered ? 1 : 0,
            'category' => $category,
            'page' => $page,
            'user_agent' => $user_agent,
            'currency' => $currency,
        ),
        array('%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s')
    );

    if ($result === false) {
        return new WP_Error('db_error', 'Failed to save log', array('status' => 500));
    }

    return array(
        'success' => true,
        'log_id' => $wpdb->insert_id,
    );
}

// Get chat logs with filters
function sgcl_get_logs($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'chatbot_logs';

    $page = max(1, intval($request->get_param('page') ?? 1));
    $per_page = min(100, max(1, intval($request->get_param('per_page') ?? 50)));
    $offset = ($page - 1) * $per_page;

    $where_clauses = array('1=1');
    $where_values = array();

    // Filter by category
    if ($category = $request->get_param('category')) {
        $where_clauses[] = 'category = %s';
        $where_values[] = sanitize_text_field($category);
    }

    // Filter by wasAnswered
    if ($request->get_param('wasAnswered') !== null) {
        $was_answered = $request->get_param('wasAnswered') === 'true' ? 1 : 0;
        $where_clauses[] = 'was_answered = %d';
        $where_values[] = $was_answered;
    }

    // Filter by date range
    if ($start_date = $request->get_param('startDate')) {
        $where_clauses[] = 'created_at >= %s';
        $where_values[] = sanitize_text_field($start_date);
    }

    if ($end_date = $request->get_param('endDate')) {
        $where_clauses[] = 'created_at <= %s';
        $where_values[] = sanitize_text_field($end_date);
    }

    // Search in messages
    if ($search = $request->get_param('search')) {
        $where_clauses[] = 'user_message LIKE %s';
        $where_values[] = '%' . $wpdb->esc_like(sanitize_text_field($search)) . '%';
    }

    $where_sql = implode(' AND ', $where_clauses);

    // Get total count
    $count_query = "SELECT COUNT(*) FROM $table_name WHERE $where_sql";
    if (!empty($where_values)) {
        $count_query = $wpdb->prepare($count_query, $where_values);
    }
    $total = $wpdb->get_var($count_query);

    // Get logs
    $query = "SELECT * FROM $table_name WHERE $where_sql ORDER BY created_at DESC LIMIT %d OFFSET %d";
    $query_values = array_merge($where_values, array($per_page, $offset));
    $logs = $wpdb->get_results($wpdb->prepare($query, $query_values));

    return array(
        'success' => true,
        'data' => $logs,
        'pagination' => array(
            'total' => intval($total),
            'page' => $page,
            'per_page' => $per_page,
            'total_pages' => ceil($total / $per_page),
        ),
    );
}

// Get analytics summary
function sgcl_get_analytics($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'chatbot_logs';

    $days = max(1, intval($request->get_param('days') ?? 30));
    $start_date = date('Y-m-d H:i:s', strtotime("-$days days"));

    // Total conversations
    $total_sessions = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(DISTINCT session_id) FROM $table_name WHERE created_at >= %s",
        $start_date
    ));

    // Total messages
    $total_messages = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE created_at >= %s",
        $start_date
    ));

    // Unanswered questions
    $unanswered = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE created_at >= %s AND was_answered = 0",
        $start_date
    ));

    // Category breakdown
    $categories = $wpdb->get_results($wpdb->prepare(
        "SELECT category, COUNT(*) as count FROM $table_name 
         WHERE created_at >= %s 
         GROUP BY category 
         ORDER BY count DESC",
        $start_date
    ));

    // Most common unanswered questions
    $top_unanswered = $wpdb->get_results($wpdb->prepare(
        "SELECT user_message, COUNT(*) as count FROM $table_name 
         WHERE created_at >= %s AND was_answered = 0 
         GROUP BY user_message 
         ORDER BY count DESC 
         LIMIT 20",
        $start_date
    ));

    // Daily message count
    $daily_messages = $wpdb->get_results($wpdb->prepare(
        "SELECT DATE(created_at) as date, COUNT(*) as count 
         FROM $table_name 
         WHERE created_at >= %s 
         GROUP BY DATE(created_at) 
         ORDER BY date ASC",
        $start_date
    ));

    return array(
        'success' => true,
        'period_days' => $days,
        'summary' => array(
            'total_sessions' => intval($total_sessions),
            'total_messages' => intval($total_messages),
            'unanswered_questions' => intval($unanswered),
            'answer_rate' => $total_messages > 0 
                ? round((($total_messages - $unanswered) / $total_messages) * 100, 1) 
                : 100,
        ),
        'categories' => $categories,
        'top_unanswered' => $top_unanswered,
        'daily_messages' => $daily_messages,
    );
}

// Add admin menu
add_action('admin_menu', 'sgcl_admin_menu');

function sgcl_admin_menu() {
    add_menu_page(
        'Chatbot Logs',
        'Chatbot Logs',
        'manage_options',
        'chatbot-logs',
        'sgcl_admin_page',
        'dashicons-format-chat',
        30
    );
}

// Admin page
function sgcl_admin_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'chatbot_logs';

    // Get quick stats
    $total_logs = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    $unanswered = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE was_answered = 0");
    $today_logs = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE DATE(created_at) = %s",
        date('Y-m-d')
    ));

    ?>
    <div class="wrap">
        <h1>Salary Guide Chatbot Logs</h1>
        
        <div style="display: flex; gap: 20px; margin: 20px 0;">
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0; color: #666;">Total Messages</h3>
                <p style="font-size: 32px; margin: 10px 0; font-weight: bold;"><?php echo number_format($total_logs); ?></p>
            </div>
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0; color: #666;">Unanswered</h3>
                <p style="font-size: 32px; margin: 10px 0; font-weight: bold; color: #e74c3c;"><?php echo number_format($unanswered); ?></p>
            </div>
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0; color: #666;">Today</h3>
                <p style="font-size: 32px; margin: 10px 0; font-weight: bold; color: #27ae60;"><?php echo number_format($today_logs); ?></p>
            </div>
        </div>

        <h2>Recent Unanswered Questions</h2>
        <p style="color: #666;">These questions couldn't be answered by the bot. Consider adding content for these topics.</p>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Question</th>
                    <th width="150">Date</th>
                    <th width="100">Page</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $unanswered_logs = $wpdb->get_results(
                    "SELECT * FROM $table_name WHERE was_answered = 0 ORDER BY created_at DESC LIMIT 50"
                );
                foreach ($unanswered_logs as $log) {
                    echo '<tr>';
                    echo '<td>' . esc_html($log->user_message) . '</td>';
                    echo '<td>' . esc_html(date('M j, Y g:i a', strtotime($log->created_at))) . '</td>';
                    echo '<td>' . esc_html($log->page) . '</td>';
                    echo '</tr>';
                }
                if (empty($unanswered_logs)) {
                    echo '<tr><td colspan="3">No unanswered questions yet!</td></tr>';
                }
                ?>
            </tbody>
        </table>

        <h2 style="margin-top: 30px;">Category Breakdown</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Category</th>
                    <th width="150">Count</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $categories = $wpdb->get_results(
                    "SELECT category, COUNT(*) as count FROM $table_name GROUP BY category ORDER BY count DESC"
                );
                foreach ($categories as $cat) {
                    echo '<tr>';
                    echo '<td>' . esc_html($cat->category) . '</td>';
                    echo '<td>' . number_format($cat->count) . '</td>';
                    echo '</tr>';
                }
                ?>
            </tbody>
        </table>

        <h2 style="margin-top: 30px;">API Settings</h2>
        <p>Use this endpoint to send chat logs: <code><?php echo rest_url('chatbot/v1/logs'); ?></code></p>
    </div>
    <?php
}
