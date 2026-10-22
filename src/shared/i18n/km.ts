import type { Translations } from './en';

export const km: Translations = {
  // Common
  appName: 'Learnly',
  loading: 'កំពុងផ្ទុក…',
  save: 'រក្សាទុក',
  cancel: 'បោះបង់',
  search: 'ស្វែងរក…',
  noResults: 'រកមិនឃើញលទ្ធផល',
  viewAll: 'មើលទាំងអស់',
  seeMore: 'មើលបន្ថែម',

  // Auth
  auth: {
    signIn: 'ចូល',
    signUp: 'បង្កើតគណនី',
    signOut: 'ចាកចេញ',
    signingIn: 'កំពុងចូល…',
    creatingAccount: 'កំពុងបង្កើតគណនី…',
    email: 'អ៊ីមែល',
    emailPlaceholder: 'you@school.edu',
    password: 'ពាក្យសម្ងាត់',
    passwordPlaceholder: 'យ៉ាងហោចណាស់ ៨ តួអក្សរ',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
    confirmPlaceholder: 'វាយពាក្យសម្ងាត់ម្តងទៀត',
    fullName: 'ឈ្មោះពេញ',
    namePlaceholder: 'សុខា ចាន់',
    rememberMe: 'ចងចាំខ្ញុំនៅលើឧបករណ៍នេះ',
    forgotPassword: 'ភ្លេចពាក្យសម្ងាត់?',
    noAccount: 'ថ្មីនៅ Learnly?',
    hasAccount: 'មានគណនីរួចហើយ?',
    createAccount: 'បង្កើតគណនី',
    useSchoolAccount: 'ប្រើគណនីសាលារៀន ឬការងាររបស់អ្នក។',
    takeAMinute: 'វាចំណាយពេលតិចជាងមួយនាទី។',
    continueGoogle: 'បន្តជាមួយ Google',
    orUseEmail: 'ឬប្រើអ៊ីមែល',
    iAmA: 'ខ្ញុំគឺជា',
    student: 'សិស្ស',
    instructor: 'គ្រូបង្រៀន',
    agreeTerms: 'ខ្ញុំយល់ព្រមតាម',
    termsOfService: 'លក្ខខណ្ឌប្រើប្រាស់',
    and: 'និង',
    privacyPolicy: 'គោលការណ៍ឯកជនភាព',
    show: 'បង្ហាញ',
    hide: 'លាក់',

    // Validation
    validEmail: 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។',
    validName: 'សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។',
    passwordMin: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ។',
    passwordMismatch: 'ពាក្យសម្ងាត់មិនត្រូវគ្នា។',
    acceptTerms: 'ទទួលយកលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាពដើម្បីបន្ត។',
    loginError: 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។',
    registerError: 'មិនអាចបង្កើតគណនីបានទេ។ សូមព្យាយាមម្តងទៀត។',

    // Password strength
    strength: 'កម្លាំង',
    tooShort: 'ខ្លីពេក',
    weak: 'ខ្សោយ',
    fair: 'មធ្យម',
    good: 'ល្អ',
    strong: 'រឹងមាំ',
    strengthHint: 'ប្រើអក្សរធំ អក្សរតូច លេខ និងនិមិត្តសញ្ញា។',

    // Brand panel
    loginHeading: 'បន្តពីកន្លែងដែលអ្នកឈប់។',
    loginSubtext: 'វគ្គសិក្សា កិច្ចការ និងពិន្ទុរបស់អ្នកកំពុងរង់ចាំ។',
    inProgress: 'កំពុងដំណើរការ',
    registerHeading: 'ចាប់ផ្ដើមរៀនក្នុងរយៈពេលប៉ុន្មាននាទី។',
    registerSubtext: 'បង្កើតគណនីឥតគិតថ្លៃដើម្បីចូលរៀន និងតាមដានវឌ្ឍនភាព។',
    perks: [
      { title: 'រៀនតាមល្បឿនរបស់អ្នក', text: 'រៀនមេរៀនណាមួយនៅលើឧបករណ៍ណាមួយ វឌ្ឍនភាពរបស់អ្នកនឹងតាមអ្នក។' },
      { title: 'ដាក់ និងតាមដានកិច្ចការ', text: 'មើលកាលកំណត់ មតិត្រឡប់ និងពិន្ទុ ដោយមិនចាំបាច់រកអ៊ីមែល។' },
      { title: 'ទទួលវិញ្ញាបនបត្រ', text: 'បញ្ចប់វគ្គសិក្សា និងទាញយកភស្តុតាង។' },
    ],
  },

  // Sidebar navigation
  nav: {
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    students: 'សិស្ស',
    teachers: 'គ្រូបង្រៀន',
    auth: 'គណនីផ្ទៀងផ្ទាត់',
    myCourses: 'វគ្គសិក្សារបស់ខ្ញុំ',

    assignments: 'កិច្ចការ',
    grades: 'ពិន្ទុ',
    calendar: 'ប្រតិទិន',
    messages: 'សារ',
    certificates: 'វិញ្ញាបនបត្រ',
    settings: 'ការកំណត់',
    help: 'ជំនួយ និងគាំទ្រ',
  },

  // Topbar
  topbar: {
    searchPlaceholder: 'ស្វែងរកវគ្គសិក្សា កិច្ចការ…',
    notifications: 'ការជូនដំណឹង',
    profile: 'ប្រវត្តិរូប',
    settings: 'ការកំណត់',
    signOut: 'ចាកចេញ',
  },

  // Dashboard
  dashboard: {
    welcome: 'សូមស្វាគមន៍',
    overview: 'នេះគឺជាអ្វីដែលកំពុងកើតឡើងជាមួយការសិក្សារបស់អ្នកថ្ងៃនេះ។',

    // Stats
    enrolledCourses: 'វគ្គសិក្សាដែលបានចុះឈ្មោះ',
    completed: 'បានបញ្ចប់',
    certificates: 'វិញ្ញាបនបត្រ',
    hoursLearned: 'ម៉ោងដែលបានរៀន',

    // Sections
    myCourses: 'វគ្គសិក្សារបស់ខ្ញុំ',
    continueLabel: 'បន្ត',
    progress: 'វឌ្ឍនភាព',
    recentActivity: 'សកម្មភាពថ្មីៗ',
    upcomingDeadlines: 'កាលកំណត់នាពេលខាងមុខ',
    announcements: 'សេចក្ដីប្រកាស',
    dueIn: 'ផុតកំណត់ក្នុង',
    days: 'ថ្ងៃ',
    day: 'ថ្ងៃ',
    hours: 'ម៉ោង',
    hour: 'ម៉ោង',
    today: 'ថ្ងៃនេះ',
    yesterday: 'ម្សិលមិញ',
    justNow: 'ទើបតែ',
    minutesAgo: 'នាទីមុន',
    hoursAgo: 'ម៉ោងមុន',
    noDeadlines: 'គ្មានកាលកំណត់ជិតមកដល់ទេ!',
    noAnnouncements: 'គ្មានសេចក្ដីប្រកាសថ្មីទេ។',
  },

  // Theme
  theme: {
    light: 'ភ្លឺ',
    dark: 'ងងឹត',
    toggle: 'ប្ដូររចនាប័ទ្ម',
  },

  // Language
  language: {
    en: 'English',
    km: 'ខ្មែរ',
    switch: 'ភាសា',
  },
};
