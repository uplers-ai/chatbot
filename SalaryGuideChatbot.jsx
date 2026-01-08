'use client'

import React, { useState, useRef, useEffect } from 'react'

// Knowledge base with both INR and USD salaries
const KNOWLEDGE_BASE = {
  salaries: {
    engineering: {
      "full stack engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "frontend engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "backend engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "data engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$3,500", "8+": "$3,500+" } },
      "cloud/devops engineer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "devops engineer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "mobile engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "flutter engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "react native engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "product engineer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "python engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "data scientist": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-45 Lakhs", "8+": "45 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,500", "8+": "$4,500+" } },
      "cybersecurity engineer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "platform engineer": { INR: { "3-5": "25-30 Lakhs", "5-8": "30-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,500-$3,000", "5-8": "$3,000-$3,500", "8+": "$3,500+" } },
      "ml ops engineer": { INR: { "3-5": "25-35 Lakhs", "5-8": "35-45 Lakhs", "8+": "45 Lakhs+" }, USD: { "3-5": "$2,500-$3,500", "5-8": "$3,500-$4,500", "8+": "$4,500+" } },
      "mlops engineer": { INR: { "3-5": "25-35 Lakhs", "5-8": "35-45 Lakhs", "8+": "45 Lakhs+" }, USD: { "3-5": "$2,500-$3,500", "5-8": "$3,500-$4,500", "8+": "$4,500+" } },
      "solutions architect": { INR: { "3-5": "N/A", "5-8": "35-45 Lakhs", "8+": "45 Lakhs+" }, USD: { "3-5": "N/A", "5-8": "$3,500-$4,500", "8+": "$4,500+" } },
      "qa automation engineer": { INR: { "3-5": "15-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$1,500-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "qa engineer": { INR: { "3-5": "15-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$1,500-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "site reliability engineer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "sre": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      ".net engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } },
      "dotnet engineer": { INR: { "3-5": "20-30 Lakhs", "5-8": "30-40 Lakhs", "8+": "40 Lakhs+" }, USD: { "3-5": "$2,000-$3,000", "5-8": "$3,000-$4,000", "8+": "$4,000+" } }
    },
    productAndGTM: {
      "product manager": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "product/ux designer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "ux designer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "ui designer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "growth marketer": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } },
      "customer success": { INR: { "3-5": "20-25 Lakhs", "5-8": "25-35 Lakhs", "8+": "35 Lakhs+" }, USD: { "3-5": "$2,000-$2,500", "5-8": "$2,500-$3,500", "8+": "$3,500+" } }
    },
    aiml: {
      topTier: { INR: { "3-5": "30-35 Lakhs", "5-7": "35-60 Lakhs", "7+": "60 Lakhs+" }, USD: { "3-5": "$3,000-$3,500", "5-7": "$3,500-$6,000", "7+": "$6,000+" } },
      productCompany: { INR: { "3-5": "25-35 Lakhs", "5-7": "35-45 Lakhs", "7+": "45 Lakhs+" }, USD: { "3-5": "$2,500-$3,500", "5-7": "$3,500-$4,500", "7+": "$4,500+" } }
    }
  },
  stats: {
    gics: "1,000+", gicEmployees: "745,000", gicRevenue: "~$19B annually",
    startupFailRate: "90% fail within 5 years, 25% in first year",
    ecosystemGrowth: "16.8%", totalStartups: "150,000+", unicorns: "125",
    startupProfessionals: "600,000+", aimlFromPremiumInstitutes: "14,570",
    topProfessionalsInProduct: "41,506", topTierGraduates: "110,297",
    maangExperience: "39,731", midLevelTalentPool: "23.5% have 5-8 years experience",
    uplersClients: "500+", linkedinFollowers: "1 Million+"
  },
  topCities: ["Bengaluru", "Hyderabad", "Gurgaon"],
  topRoles2025: ["AI/ML Engineer", "Fullstack Engineer", "Backend Engineer"],
  topSectors2025: ["AI native", "FinTech", "HealthTech"],
  interviewFramework: {
    round1: { name: "Initial Screening", duration: "20-30 minutes", purpose: "Gauge basics of skill, mindset, culture, ambition" },
    round2: { name: "Technical Assessment", duration: "2-4 hours", purpose: "Problem solving, coding, architecture, testing logic" },
    round3: { name: "Cultural Round", duration: "45-60 minutes", purpose: "Product mindset, ownership, team-fit, scalability" },
    round4: { name: "Final Discussion", duration: "20-30 minutes", purpose: "Role expectations, joining date, compensation, next steps" }
  },
  blindSpots: [
    { name: "Elaborate interview process", issue: "6-round processes cause dropouts", solution: "Use lean 4-step process" },
    { name: "Experience gap in screening", issue: "Junior recruiters create friction with senior candidates", solution: "Use senior recruiter or specialized hiring partner" },
    { name: "Mismatched budget benchmarking", issue: "Benchmarking against average Indian salaries loses top talent", solution: "Benchmark against product companies" },
    { name: "Talent background misalignment", issue: "Service background talent often can't deliver ownership in product roles", solution: "Focus on hiring from product background" },
    { name: "Backouts", issue: "60-90 day notice periods and competitive market cause offer rejections", solution: "Target 30-day or immediate joiners, keep backups, stay connected during notice" }
  ],
  ecosystem: {
    service: { purpose: "Deliver what client asks", mindset: "Execution", workModel: "Fixed scope, clear specs", growthDriver: "Billable hours", salaryExpectation: "Lower", culturalFit: "Low" },
    product: { purpose: "Build what users need", mindset: "Ownership", workModel: "Iterative, feedback-driven", growthDriver: "Innovation, adoption", salaryExpectation: "Higher", culturalFit: "High" }
  }
}

const MEETING_LINK = "https://calendly.com/uplers/30min?back=1&month=2026-01"
const SALARY_GUIDE_LINK = "https://www.uplers.com/india-salary-guide-2026/?utm_source=hs_automation&utm_medium=email&utm_content=393967408"

const findSalary = (role, currency) => {
  const normalizedRole = role.toLowerCase().trim()
  for (const [key, value] of Object.entries(KNOWLEDGE_BASE.salaries.engineering)) {
    if (normalizedRole.includes(key) || key.includes(normalizedRole)) {
      return { role: key, salaries: value[currency], category: "Engineering" }
    }
  }
  for (const [key, value] of Object.entries(KNOWLEDGE_BASE.salaries.productAndGTM)) {
    if (normalizedRole.includes(key) || key.includes(normalizedRole)) {
      return { role: key, salaries: value[currency], category: "Product & GTM" }
    }
  }
  return null
}

const generateResponse = (query, currency) => {
  const q = query.toLowerCase()
  let wasAnswered = true
  let response = ""
  let category = "general"
  const salaryLabel = currency === 'USD' ? 'per month' : 'per year'

  if (q.match(/^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening|greetings)[\s!?]*$/)) {
    response = `Hi! 👋 I'm the Uplers' 2026 Salary Guide assistant. Ask me about engineering salaries in India, hiring best practices, or the Indian hiring ecosystem. How can I help?`
    category = "greeting"
  }
  else if (q.includes("ai") || q.includes("ml") || q.includes("machine learning") || q.includes("artificial intelligence")) {
    category = "salary_aiml"
    const aiml = KNOWLEDGE_BASE.salaries.aiml
    if (q.includes("iit") || q.includes("bits") || q.includes("iim") || q.includes("top tier") || q.includes("premium")) {
      const s = aiml.topTier[currency]
      response = `**AI/ML Engineer Salaries (Top-tier Pedigree - IITs, BITS, IIMs):**\n\n• 3-5 years: ${s["3-5"]} ${salaryLabel}\n• 5-7 years: ${s["5-7"]} ${salaryLabel}\n• 7+ years: ${s["7+"]} ${salaryLabel}`
    } else {
      const prod = aiml.productCompany[currency]
      const top = aiml.topTier[currency]
      response = `**AI/ML Engineer Salaries:**\n\n**Product Company Experience:**\n• 3-5 years: ${prod["3-5"]} ${salaryLabel}\n• 5-7 years: ${prod["5-7"]} ${salaryLabel}\n• 7+ years: ${prod["7+"]} ${salaryLabel}\n\n**Top-tier Pedigree (IITs, BITS, IIMs):**\n• 3-5 years: ${top["3-5"]} ${salaryLabel}\n• 5-7 years: ${top["5-7"]} ${salaryLabel}\n• 7+ years: ${top["7+"]} ${salaryLabel}\n\nAI/ML hires through Uplers grew by 260% between 2023-2025.`
    }
  }
  else if (q.includes("salary") || q.includes("pay") || q.includes("compensation") || q.includes("ctc") || q.includes("package") || q.includes("earn")) {
    category = "salary_query"
    const roles = ["full stack", "fullstack", "frontend", "backend", "data engineer", "devops", "cloud", "mobile", "flutter", "react native", "product engineer", "python", "data scientist", "cybersecurity", "platform", "mlops", "ml ops", "solutions architect", "qa", "sre", ".net", "dotnet", "product manager", "ux", "ui", "designer", "growth", "customer success"]
    let found = false
    for (const role of roles) {
      if (q.includes(role)) {
        const result = findSalary(role, currency)
        if (result) {
          response = `**${result.role.charAt(0).toUpperCase() + result.role.slice(1)} Salaries (${result.category}):**\n\n• 3-5 years: ${result.salaries["3-5"]} ${salaryLabel}\n• 5-8 years: ${result.salaries["5-8"]} ${salaryLabel}\n• 8+ years: ${result.salaries["8+"]} ${salaryLabel}\n\nThese are for product companies/startups in India (2026).`
          found = true
          break
        }
      }
    }
    if (!found) {
      const sample = currency === 'USD' ? '$4,000+' : '40 Lakhs+'
      response = `I have salary data for 20+ roles. Some highlights (8+ years):\n\n**Engineering:** Full Stack/Backend: ${sample} ${salaryLabel}\n**Data Scientist:** ${currency === 'USD' ? '$4,500+' : '45 Lakhs+'} ${salaryLabel}\n\nAsk about a specific role for detailed breakdown.`
    }
  }
  else {
    const roleKeywords = [
      { terms: ["full stack", "fullstack"], role: "full stack engineer" },
      { terms: ["frontend", "front end"], role: "frontend engineer" },
      { terms: ["backend", "back end"], role: "backend engineer" },
      { terms: ["data engineer"], role: "data engineer" },
      { terms: ["devops", "cloud engineer"], role: "cloud/devops engineer" },
      { terms: ["mobile", "flutter", "react native"], role: "mobile engineer" },
      { terms: ["python engineer", "python developer"], role: "python engineer" },
      { terms: ["data scientist"], role: "data scientist" },
      { terms: ["product manager", "pm role"], role: "product manager" },
      { terms: ["ux designer", "ui designer", "product designer"], role: "product/ux designer" },
      { terms: ["qa", "automation engineer", "test engineer"], role: "qa automation engineer" },
      { terms: ["sre", "site reliability"], role: "site reliability engineer" },
      { terms: [".net", "dotnet"], role: ".net engineer" },
      { terms: ["cybersecurity", "security engineer"], role: "cybersecurity engineer" },
      { terms: ["platform engineer"], role: "platform engineer" },
      { terms: ["mlops", "ml ops"], role: "ml ops engineer" },
      { terms: ["solutions architect"], role: "solutions architect" },
      { terms: ["growth marketer"], role: "growth marketer" },
      { terms: ["customer success"], role: "customer success" },
    ]

    let roleFound = false
    for (const { terms, role } of roleKeywords) {
      if (terms.some(term => q.includes(term))) {
        const result = findSalary(role, currency)
        if (result) {
          response = `**${result.role.charAt(0).toUpperCase() + result.role.slice(1)} Salaries:**\n\n• 3-5 years: ${result.salaries["3-5"]} ${salaryLabel}\n• 5-8 years: ${result.salaries["5-8"]} ${salaryLabel}\n• 8+ years: ${result.salaries["8+"]} ${salaryLabel}`
          category = "salary_role"
          roleFound = true
          break
        }
      }
    }

    if (!roleFound) {
      if (q.includes("interview") || q.includes("hiring process")) {
        const fw = KNOWLEDGE_BASE.interviewFramework
        response = `**Recommended 4-Step Interview Framework:**\n\n**1. ${fw.round1.name}**\n${fw.round1.purpose}\n\n**2. ${fw.round2.name}**\n${fw.round2.purpose}\n\n**3. ${fw.round3.name}**\n${fw.round3.purpose}\n\n**4. ${fw.round4.name}**\n${fw.round4.purpose}`
        category = "interview"
      }
      else if (q.includes("blind spot") || q.includes("mistake") || q.includes("avoid")) {
        response = `**5 Hiring Blind Spots:**\n\n1. Elaborate Interview Process\n2. Experience Gap in Screening\n3. Mismatched Budget Benchmarking\n4. Talent Background Misalignment\n5. Backouts\n\nAsk for details on any of these.`
        category = "blind_spots"
      }
      else if (q.includes("backout") || q.includes("notice period")) {
        response = `**Handling Backouts:**\n\nBackouts are common due to 60-90 day notice periods.\n\n**Solutions:**\n• Target 30-day joiners\n• Keep backups\n• Stay connected\n\nWant to discuss? <a href="${MEETING_LINK}" target="_blank" class="text-[#FFD93D] underline">Schedule a call with us</a>`
        category = "backouts"
      }
      else if (q.includes("service") || q.includes("product")) {
        response = `**Service vs Product Ecosystem:**\n\n**Service:** Delivery focused, lower cost.\n**Product:** Innovation focused, ownership mindset, higher cost.\n\nInsight: Hire from product background for startups.`
        category = "ecosystem"
      }
      else if (q.includes("gic")) {
        response = `**Global Innovation Centers (GICs):**\n\n• ${KNOWLEDGE_BASE.stats.gics} GICs in India\n• Employing ${KNOWLEDGE_BASE.stats.gicEmployees}\n• Top cities: Bengaluru, Hyderabad, Gurgaon`
        category = "gic"
      }
      else if (q.includes("uplers")) {
        response = `**About Uplers:**\n\nWe sort India's top tech talent for global startups.\n\n• ${KNOWLEDGE_BASE.stats.uplersClients} clients\n• BrowserStack, GitLab, Airbnb\n\nWant to learn more? <a href="${MEETING_LINK}" target="_blank" class="text-[#FFD93D] underline">Schedule a 30-min call</a>`
        category = "about_uplers"
      }
      else {
        response = `I'm sorry, I don't have information about that topic in my current knowledge base. I'm specifically trained on the Uplers India Salary Guide 2026, which covers:\n\n• Salary ranges for top 20 engineering roles in India\n• Hiring ecosystem insights\n• Interview frameworks and best practices and a lot more\n\n - <a href="${SALARY_GUIDE_LINK}" target="_blank" class="text-[#FFD93D] underline">${SALARY_GUIDE_LINK}</a>\n\nIf you have any other questions or feedback on what we can do better, our team would be happy to help.\n\n<a href="${MEETING_LINK}" target="_blank" class="text-[#FFD93D] underline">Book a call with us now</a>`
        wasAnswered = false
        category = "unanswered"
      }
    }
  }

  return { response, wasAnswered, category }
}

const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export default function SalaryGuideChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [currency, setCurrency] = useState('USD') // Default to USD, will be overridden by useEffect
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const messagesEndRef = useRef(null)

  // Auto-detect currency on mount
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      // Check for Indian timezones (Asia/Kolkata, Asia/Calcutta)
      const isIndia = timeZone && (
        timeZone === 'Asia/Kolkata' || 
        timeZone === 'Asia/Calcutta' ||
        timeZone.includes('Kolkata') ||
        timeZone.includes('Calcutta')
      )
      
      if (isIndia) {
        setCurrency('INR')
        console.log('Detected Indian timezone:', timeZone, '→ Currency: INR')
      } else {
        setCurrency('USD')
        console.log('Detected timezone:', timeZone, '→ Currency: USD')
      }
    } catch (e) {
      setCurrency('USD')
      console.log('Timezone detection failed, defaulting to USD')
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const logChat = async (userMessage, botResponse, wasAnswered, category) => {
    try {
      await fetch('/api/chat-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId, userMessage, botResponse, wasAnswered, category, currency,
          timestamp: new Date().toISOString(),
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      })
    } catch (error) {
      console.error('Failed to log chat:', error)
    }
  }

  // Logic from chatbot-demo.html: Relaxed constraint
  const findSalary = (role, curr) => {
    const norm = role.toLowerCase().trim()
    for (const [key, val] of Object.entries(KNOWLEDGE_BASE.salaries.engineering)) {
      if (norm.includes(key) || key.includes(norm)) return { role: key, salaries: val[curr], category: "Engineering" }
    }
    for (const [key, val] of Object.entries(KNOWLEDGE_BASE.salaries.productAndGTM)) {
      if (norm.includes(key) || key.includes(norm)) return { role: key, salaries: val[curr], category: "Product/GTM" }
    }
    return null
  }

  const generateResponseRelaxes = (query, curr) => {
    const q = query.toLowerCase()
    const label = curr === 'USD' ? 'per month' : 'per year'
    let wasAnswered = true
    let category = "general"
    let response = ""

    // Greeting check
    if (q.match(/^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening|greetings)[\s!?]*$/)) {
      response = `Hi! 👋 I'm the Uplers' 2026 Salary Guide assistant. Ask me about engineering salaries in India, hiring best practices, or the Indian hiring ecosystem. How can I help?`
      category = "greeting"
      return { response, wasAnswered, category }
    }

    // Direct Role Checks (No "salary" keyword needed)
    if (q.includes("ai") || q.includes("ml") || q.includes("artificial intelligence")) {
      const aiml = KNOWLEDGE_BASE.salaries.aiml.productCompany[curr]
      response = `**AI/ML Engineer Salaries (Product Companies):**\n\n• 3-5 years: ${aiml["3-5"]} ${label}\n• 5-7 years: ${aiml["5-7"]} ${label}\n• 7+ years: ${aiml["7+"]} ${label}`
      category = "AI/ML"
      return { response, wasAnswered, category }
    }

    const roles = ["full stack", "frontend", "backend", "data engineer", "devops", "data scientist", "product manager", "ux", "ui", "cybersecurity", "engineer", "architect", "sre", ".net", "dotnet"]
    for (const r of roles) {
      if (q.includes(r)) {
        const res = findSalary(r, curr)
        if (res) {
          response = `**${res.role.toUpperCase()} Salaries:**\n\n• 3-5 years: ${res.salaries["3-5"]} ${label}\n• 5-8 years: ${res.salaries["5-8"]} ${label}\n• 8+ years: ${res.salaries["8+"]} ${label}`
          category = res.category
          return { response, wasAnswered, category }
        }
      }
    }

    if (q.includes("uplers") || q.includes("who are you")) {
      response = `**About Uplers:** We help global companies hire top product talent from India. <a href="https://calendly.com/uplers/30min?back=1&month=2026-01" target="_blank">Schedule a 30-min call</a> to learn more.`
      category = "About"
    } else {
      response = `I'm sorry, I don't have information about that topic in my current knowledge base. I'm specifically trained on the Uplers India Salary Guide 2026, which covers:\n\n• Salary ranges for top 20 engineering roles in India\n• Hiring ecosystem insights\n• Interview frameworks and best practices\n....and a lot more\n\nYou can download the salary guide here - <a href="${SALARY_GUIDE_LINK}" target="_blank">${SALARY_GUIDE_LINK}</a>\n\nIf you have any other questions or feedback on what we can do better, our team would be happy to help.\n\n<a href="${MEETING_LINK}" target="_blank">Book a call with us now</a>`
      wasAnswered = false
      category = "unanswered"
    }

    return { response, wasAnswered, category }
  }

  const handleSend = async (overrideInput = null) => {
    const textToSend = overrideInput !== null ? overrideInput : input
    if (!textToSend.trim()) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: textToSend }])
    setInput('')
    setIsTyping(true)

    // Simulate delay
    setTimeout(async () => {
      const { response, wasAnswered, category } = generateResponseRelaxes(textToSend, currency)
      setMessages(prev => [...prev, { type: 'bot', text: response }])
      setIsTyping(false)
      await logChat(textToSend, response, wasAnswered, category)
    }, 1500 + Math.random() * 500)
  }

  const handleFloatingSubmit = (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim()
      if (val) {
        setIsOpen(true)
        handleSend(val)
        e.target.value = ''
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "Full Stack Engineer salary",
    "AI/ML Engineer pay",
    "Interview process",
    "Hiring blind spots"
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen && (
        <div className="bg-white rounded-full shadow-xl border border-gray-200 p-2 flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-2xl hover:border-[#FFD93D] w-64">
          <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#FFD93D] cursor-pointer" onClick={() => setIsOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
            placeholder="Ask anything..."
            onKeyPress={handleFloatingSubmit}
          />
        </div>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] flex flex-col overflow-hidden border border-gray-200" style={{ height: '600px', maxHeight: 'calc(100vh - 2rem)' }}>
          <div className="bg-[#1a1a1a] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD93D] rounded-full flex items-center justify-center">
                <span className="text-[#1a1a1a] font-bold text-lg">U</span>
              </div>
              <div>
                <h3 className="font-semibold">Salary Guide Assistant</h3>
                <p className="text-xs text-gray-300">India 2026 Edition</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <p className="text-4xl mb-2">👋</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.type === 'user' ? 'bg-[#1a1a1a] text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'}`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-inherit">$1</strong>')
                      .replace(msg.type === 'user' ? '' : /<a href="(.*?)"(.*?)>(.*?)<\/a>/g, '<a href="$1" $2 class="text-[#FFD93D] underline hover:text-yellow-600">$3</a>')
                  }} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Typing</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#FFD93D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#FFD93D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#FFD93D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (optional, show only if empty) */}
          {messages.length === 0 && (
            <div className="px-4 pb-2 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2 font-medium">Popular questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <button key={idx} onClick={() => { setInput(q); setTimeout(() => handleSend(), 100) }} className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-[#FFD93D] hover:border-[#FFD93D] hover:text-[#1a1a1a] transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#FFD93D] focus:ring-1 focus:ring-[#FFD93D] transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="bg-[#1a1a1a] text-white rounded-full p-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
