export const en = {
  // Common
  appName: 'Learnly',
  loading: 'Loading…',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search…',
  noResults: 'No results found',
  viewAll: 'View all',
  seeMore: 'See more',

  // Auth
  auth: {
    signIn: 'Sign in',
    signUp: 'Create account',
    signOut: 'Sign out',
    signingIn: 'Signing in…',
    creatingAccount: 'Creating account…',
    email: 'Email',
    emailPlaceholder: 'you@school.edu',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    confirmPassword: 'Confirm password',
    confirmPlaceholder: 'Re-enter your password',
    fullName: 'Full name',
    namePlaceholder: 'Sokha Chan',
    rememberMe: 'Keep me signed in on this device',
    forgotPassword: 'Forgot password?',
    noAccount: 'New to Learnly?',
    hasAccount: 'Already have an account?',
    createAccount: 'Create an account',
    useSchoolAccount: 'Use your school or work account.',
    takeAMinute: 'It takes less than a minute.',
    continueGoogle: 'Continue with Google',
    orUseEmail: 'or use email',
    iAmA: 'I am a',
    student: 'Student',
    instructor: 'Instructor',
    agreeTerms: 'I agree to the',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    show: 'Show',
    hide: 'Hide',

    // Validation
    validEmail: 'Enter a valid email address.',
    validName: 'Enter your full name.',
    passwordMin: 'Password must be at least 8 characters.',
    passwordMismatch: "Passwords don't match.",
    acceptTerms: 'Accept the terms and privacy policy to continue.',
    loginError: 'Email or password is incorrect. Try again or reset your password.',
    registerError: "We couldn't create your account. Try again in a moment.",

    // Password strength
    strength: 'Strength',
    tooShort: 'Too short',
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    strengthHint: 'Use upper and lower case, a number and a symbol.',

    // Forgot & Reset Password
    forgotHeading: 'Reset your password',
    forgotSubtext: 'Enter your email address and we will send you instructions to reset your password.',
    sendResetLink: 'Send reset link',
    sendingResetLink: 'Sending reset link…',
    resetEmailSentTitle: 'Check your email',
    resetEmailSentText: 'We sent password reset instructions to your email address.',
    resetHeading: 'Choose a new password',
    resetSubtext: 'Must be at least 8 characters long.',
    resetButton: 'Reset password',
    resettingButton: 'Resetting password…',
    resetSuccessTitle: 'Password reset successful',
    resetSuccessText: 'Your password has been changed. You can now sign in with your new password.',
    backToSignIn: 'Back to sign in',
    token: 'Reset token',
    tokenPlaceholder: 'Paste your reset token from email',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm new password',


    // Brand panel
    loginHeading: 'Pick up where you left off.',
    loginSubtext: 'Your courses, assignments and grades are waiting in one place.',
    inProgress: 'In progress',
    registerHeading: 'Start learning in minutes.',
    registerSubtext: 'Create a free account to join courses, hand in work and track your progress.',
    perks: [
      { title: 'Learn at your own pace', text: 'Pick up any lesson on any device, and your progress follows you.' },
      { title: 'Submit and track assignments', text: 'See deadlines, feedback and grades without chasing emails.' },
      { title: 'Earn certificates', text: 'Finish a course and download proof of completion.' },
    ],
  },

  // Sidebar navigation
  nav: {
    dashboard: 'Dashboard',
    students: 'Students',
    teachers: 'Teachers',
    auth: 'Auth Accounts',
    myCourses: 'My Courses',

    assignments: 'Assignments',
    grades: 'Grades',
    calendar: 'Calendar',
    messages: 'Messages',
    certificates: 'Certificates',
    settings: 'Settings',
    help: 'Help & Support',
  },

  // Topbar
  topbar: {
    searchPlaceholder: 'Search courses, assignments…',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign out',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back',
    overview: 'Here\'s what\'s happening with your learning today.',

    // Stats
    enrolledCourses: 'Enrolled Courses',
    completed: 'Completed',
    certificates: 'Certificates',
    hoursLearned: 'Hours Learned',

    // Sections
    myCourses: 'My Courses',
    continueLabel: 'Continue',
    progress: 'Progress',
    recentActivity: 'Recent Activity',
    upcomingDeadlines: 'Upcoming Deadlines',
    announcements: 'Announcements',
    dueIn: 'Due in',
    days: 'days',
    day: 'day',
    hours: 'hours',
    hour: 'hour',
    today: 'Today',
    yesterday: 'Yesterday',
    justNow: 'Just now',
    minutesAgo: 'min ago',
    hoursAgo: 'hr ago',
    noDeadlines: 'No upcoming deadlines!',
    noAnnouncements: 'No new announcements.',
  },

  // Theme
  theme: {
    light: 'Light',
    dark: 'Dark',
    toggle: 'Toggle theme',
  },

  // Language
  language: {
    en: 'English',
    km: 'ខ្មែរ',
    switch: 'Language',
  },
} as const;

type DeepString<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepString<U>[]
    : { [K in keyof T]: DeepString<T[K]> };

export type Translations = DeepString<typeof en>;
