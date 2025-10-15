import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'zh' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, any> = {
  en: {
    header: {
      title: 'AI Image Editor',
      points: 'Points',
      welcome: 'Welcome',
      logout: 'Logout',
      login: 'Login'
    },
    footer: {
      aboutUs: 'About Us',
      privacyPolicy: 'Privacy Policy',
      poweredBy: 'Powered by'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginButton: 'Login',
      registerButton: 'Register',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Already have an account? Login',
      changePassword: 'Change Password',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      changePasswordButton: 'Change Password',
      passwordChanged: 'Password changed successfully',
      verificationCode: 'Verification Code',
      enterVerificationCode: 'Enter verification code',
      sendCode: 'Send Code',
      pleaseEnterEmail: 'Please enter your email address first.',
      pleaseEnterValidEmail: 'Please enter a valid email address.',
      failedToSendCode: 'Failed to send verification code.',
      pleaseCompleteSecurityCheck: 'Please complete the security check.',
      usernameLettersNumbers: 'Username must contain only letters and numbers.',
      passwordMinLength: 'Password must be at least 8 characters long.',
      pleaseEnterVerificationCode: 'Please enter the verification code.',
      unexpectedError: 'An unexpected error occurred.',
      securityCheckExpired: 'Security check expired. Please try again.',
      failedToResetSecurityCheck: 'Failed to reset security check. Please refresh the page.'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      welcomeGuest: 'Welcome to the AI Image Editor',
      loginPrompt: 'Log in or sign up to get started.',
      youHave: 'You have',
      points: 'points',
      purchasePoints: 'Purchase Points',
      newTemplate: 'Create New Template',
      myTemplates: 'My Templates',
      imageEditor: 'Image Editor',
      editHistory: 'Edit History',
      orderHistory: 'Order History',
      profile: 'Profile',
      noTemplates: 'No templates yet',
      noEdits: 'No edit history',
      noOrders: 'No order history',
      customImageEditing: 'Custom Image Editing',
      customPrompt: 'Or, use your own prompt for more creative control.',
      promotionTitle: 'Sign up and get 5 points free!',
      promotionSubtitle: 'Limited time offer - Valid until October 10, 2025',
      signUpNow: 'Sign Up Now'
    },
    editor: {
      title: 'Image Editor',
      subtitle: 'Use 1 point to edit an image with an AI prompt.',
      loginToStart: 'Log in to start editing.',
      templateName: 'Template Name',
      prompt: 'Editing Prompt',
      promptPlaceholder: 'e.g., make the sky blue, add a cat',
      generateImage: 'Generate Image',
      editImage: 'Edit Image (1 Point)',
      editing: 'Editing...',
      loginToEdit: 'Login to Edit Image',
      saveTemplate: 'Save Template',
      cancel: 'Cancel',
      processing: 'Processing...',
      uploadImage: 'Upload Image',
      chooseFile: 'Choose File',
      noFileSelected: 'No file selected',
      dragDrop: 'or drag and drop',
      fileTypes: 'PNG, JPG, GIF up to 10MB',
      original: 'Original',
      edited: 'Edited',
      yourImageWillAppear: 'Your image will appear here',
      aiGeneratedResult: 'AI generated result',
      preview: 'Preview',
      insufficientPoints: 'Insufficient points. Please purchase more points to continue.',
      templateTitle: 'Image Editing Templates',
      templateSubtitle: 'Choose a template, upload your photo, and see the magic happen. Each edit costs 1 point.',
      noTemplates: 'No templates available at the moment.',
      exampleOriginal: 'Example (Original)',
      exampleEdited: 'Example (Edited)',
      yourPhoto: 'Your Photo',
      uploadYourPhoto: 'Upload your photo',
      yourResult: 'Your Result',
      yourEditedPhoto: 'Your edited photo will appear here',
      edit1Point: 'Edit (1 Point)'
    },
    payment: {
      title: 'Buy Points',
      purchasePoints: 'Purchase Points',
      selectPackage: 'Select a Package',
      points: 'Points',
      currency: 'Currency',
      amount: 'Amount',
      enterAmount: 'Enter amount',
      minimum: 'Minimum',
      youWillGet: 'You will get',
      rate: 'Rate',
      rateDescription: 'Rate: $1 USD = 2 Points. Minimum charge: $5 USD equivalent.',
      exchangeRatesUpdated: 'Exchange rates updated',
      buy: 'Buy',
      pay: 'Pay',
      payNow: 'Pay now',
      loginToPurchase: 'Login to Purchase',
      processing: 'Processing...',
      paymentSuccess: 'Payment successful! Your points will be updated shortly.',
      paymentFailed: 'Payment failed',
      cardError: 'An error occurred.',
      unexpectedError: 'An unexpected error occurred.',
      minAmountError: 'Amount must be at least'
    },
    about: {
      title: 'About AI Image Editor',
      welcome: 'Welcome to AI Image Editor, your go-to platform for transforming your images with the power of artificial intelligence. Our mission is to provide an intuitive, powerful, and accessible tool that empowers everyone—from casual users to creative professionals—to edit their images in magical new ways.',
      technologyTitle: 'Our Technology',
      technologyDesc: "At the heart of our editor is Google's state-of-the-art Gemini API. This cutting-edge technology allows us to interpret complex text prompts and apply stunning, high-quality edits to your photos. Whether you want to change the season in a landscape, add a fantastical creature to a portrait, or simply enhance colors, Gemini helps us make it happen with remarkable precision and creativity.",
      howItWorksTitle: 'How It Works',
      howItWorksDesc: 'Our platform operates on a simple and transparent points-based system. This approach ensures you only pay for what you use, making powerful AI editing affordable.',
      signUp: 'Sign Up: Create an account to get started.',
      purchasePoints: 'Purchase Points: Securely buy points using our Stripe-integrated payment system.',
      startEditing: 'Start Editing: Use your points to perform edits, either by choosing one of our pre-made templates or by writing your own custom prompts.',
      trackHistory: 'Track Your History: Easily view your past edits and purchase history right from your dashboard.',
      commitmentTitle: 'Our Commitment',
      commitmentDesc: 'We are passionate about the intersection of creativity and technology. We are committed to continuously improving the AI Image Editor by adding new features, enhancing performance, and ensuring a secure and user-friendly experience for our community.',
      thanks: 'Thank you for choosing AI Image Editor. We can\'t wait to see what you create!'
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: July 25, 2025',
      intro: 'AI Image Editor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.',
      infoCollectTitle: 'Information We Collect',
      infoCollectDesc: 'We may collect information about you in a variety of ways. The information we may collect on the Service includes:',
      personalData: 'Personal Data: When you register for an account, we collect your username and a hashed version of your password. We do not store passwords in plain text.',
      imageData: "Image Data: We process the images you upload to provide the editing service. Uploaded images are sent to our backend and the Gemini API for processing. We may temporarily cache these images to improve performance, but we do not permanently store your original or edited images unless it's part of your explicit edit history, which is tied to your account.",
      paymentData: 'Payment Data: To purchase points, you provide payment information directly to our payment processor, Stripe. We do not collect or store your full payment card details on our servers. We only store information about the transaction, such as the amount and order status.',
      usageData: 'Usage Data: We may collect information about your interactions with the application, such as the features you use and the edits you perform.',
      howWeUseTitle: 'How We Use Your Information',
      howWeUseDesc: 'We use the information we collect to:',
      createAccount: 'Create and manage your account.',
      provideService: 'Provide, operate, and maintain our application.',
      processTransactions: 'Process your transactions and manage your orders.',
      communicate: 'Communicate with you, including for customer service.',
      improveServices: 'Improve our services and develop new features.',
      monitorUsage: 'Monitor and analyze usage and trends to enhance your experience.',
      securityTitle: 'Data Security',
      securityDesc: 'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.',
      thirdPartyTitle: 'Third-Party Services',
      thirdPartyDesc: 'Our service relies on third-party services to function:',
      geminiApi: "Google Gemini API: Your uploaded images and prompts are sent to the Gemini API for processing. We encourage you to review Google's privacy policy.",
      stripe: "Stripe: All payments are processed by Stripe. Your payment information is subject to Stripe's privacy policy.",
      changesTitle: 'Changes to This Policy',
      changesDesc: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.',
      contactTitle: 'Contact Us',
      contactDesc: 'If you have any questions about this Privacy Policy, please contact us at support.img@255032.xyz.'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      date: 'Date',
      status: 'Status',
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      orderHistory: 'Order History',
      editHistory: 'Edit History',
      imageEditHistory: 'Image Edit History',
      changePassword: 'Change Password',
      updatePassword: 'Update Password',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      passwordTooShort: 'New password must be at least 8 characters long.',
      passwordsNotMatch: 'New passwords do not match.',
      passwordChanged: 'Password changed successfully',
      noOrdersYet: 'You have no orders yet.',
      noEditsYet: 'You have not edited any images yet.',
      pointsDeducted: 'Points Deducted',
      result: 'Result'
    }
  },
  zh: {
    header: {
      title: 'AI 图片编辑器',
      points: '积分',
      welcome: '欢迎',
      logout: '退出登录',
      login: '登录'
    },
    footer: {
      aboutUs: '关于我们',
      privacyPolicy: '隐私政策',
      poweredBy: '技术支持'
    },
    auth: {
      login: '登录',
      register: '注册',
      username: '用户名',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      loginButton: '登录',
      registerButton: '注册',
      switchToRegister: '没有账号？立即注册',
      switchToLogin: '已有账号？立即登录',
      changePassword: '修改密码',
      oldPassword: '旧密码',
      newPassword: '新密码',
      confirmNewPassword: '确认新密码',
      changePasswordButton: '修改密码',
      passwordChanged: '密码修改成功',
      verificationCode: '验证码',
      enterVerificationCode: '请输入验证码',
      sendCode: '发送验证码',
      pleaseEnterEmail: '请先输入您的邮箱地址。',
      pleaseEnterValidEmail: '请输入有效的邮箱地址。',
      failedToSendCode: '发送验证码失败。',
      pleaseCompleteSecurityCheck: '请完成安全验证。',
      usernameLettersNumbers: '用户名只能包含字母和数字。',
      passwordMinLength: '密码必须至少 8 个字符。',
      pleaseEnterVerificationCode: '请输入验证码。',
      unexpectedError: '发生意外错误。',
      securityCheckExpired: '安全验证已过期。请重试。',
      failedToResetSecurityCheck: '无法重置安全验证。请刷新页面。'
    },
    dashboard: {
      title: '控制台',
      welcome: '欢迎',
      welcomeGuest: '欢迎来到 AI 图片编辑器',
      loginPrompt: '登录或注册以开始使用。',
      youHave: '您拥有',
      points: '积分',
      purchasePoints: '购买积分',
      newTemplate: '创建新模板',
      myTemplates: '我的模板',
      imageEditor: '图片编辑器',
      editHistory: '编辑历史',
      orderHistory: '订单历史',
      profile: '个人资料',
      noTemplates: '暂无模板',
      noEdits: '暂无编辑历史',
      noOrders: '暂无订单历史',
      customImageEditing: '自定义图片编辑',
      customPrompt: '或者，使用您自己的提示进行更多创意控制。',
      promotionTitle: '注册即可获得 5 积分！',
      promotionSubtitle: '限时优惠 - 有效期至 2025 年 10 月 10 日',
      signUpNow: '立即注册'
    },
    editor: {
      title: '图片编辑器',
      subtitle: '使用 1 积分用 AI 提示编辑图片。',
      loginToStart: '登录以开始编辑。',
      templateName: '模板名称',
      prompt: '编辑提示',
      promptPlaceholder: '例如：让天空变蓝，添加一只猫',
      generateImage: '生成图片',
      editImage: '编辑图片（1 积分）',
      editing: '编辑中...',
      loginToEdit: '登录以编辑图片',
      saveTemplate: '保存模板',
      cancel: '取消',
      processing: '处理中...',
      uploadImage: '上传图片',
      chooseFile: '选择文件',
      noFileSelected: '未选择文件',
      dragDrop: '或拖放到此处',
      fileTypes: 'PNG、JPG、GIF 最大 10MB',
      original: '原图',
      edited: '编辑后',
      yourImageWillAppear: '您的图片将显示在这里',
      aiGeneratedResult: 'AI 生成结果',
      preview: '预览',
      insufficientPoints: '积分不足。请购买更多积分以继续。',
      templateTitle: '图片编辑模板',
      templateSubtitle: '选择模板，上传您的照片，看看奇迹发生。每次编辑需要 1 积分。',
      noTemplates: '目前没有可用的模板。',
      exampleOriginal: '示例（原图）',
      exampleEdited: '示例（编辑后）',
      yourPhoto: '您的照片',
      uploadYourPhoto: '上传您的照片',
      yourResult: '您的结果',
      yourEditedPhoto: '您编辑后的照片将显示在这里',
      edit1Point: '编辑（1 积分）'
    },
    payment: {
      title: '购买积分',
      purchasePoints: '购买积分',
      selectPackage: '选择套餐',
      points: '积分',
      currency: '货币',
      amount: '金额',
      enterAmount: '输入金额',
      minimum: '最小值',
      youWillGet: '您将获得',
      rate: '汇率',
      rateDescription: '汇率：$1 USD = 2 积分。最低充值：$5 USD 等值。',
      exchangeRatesUpdated: '汇率更新于',
      buy: '购买',
      pay: '支付',
      payNow: '立即支付',
      loginToPurchase: '登录以购买',
      processing: '处理中...',
      paymentSuccess: '支付成功！您的积分将在稍后更新。',
      paymentFailed: '支付失败',
      cardError: '发生错误。',
      unexpectedError: '发生意外错误。',
      minAmountError: '金额必须至少为'
    },
    about: {
      title: '关于 AI 图片编辑器',
      welcome: '欢迎使用 AI 图片编辑器，您的图片转换平台，借助人工智能的力量。我们的使命是提供一个直观、强大且易于使用的工具，让所有人——从普通用户到创意专业人士——都能以神奇的方式编辑他们的图片。',
      technologyTitle: '我们的技术',
      technologyDesc: '我们编辑器的核心是谷歌的先进 Gemini API。这项尖端技术使我们能够解释复杂的文本提示，并对您的照片应用令人惊叹的高质量编辑。无论您是想改变风景中的季节、在肖像中添加幻想生物，还是简单地增强颜色，Gemini 都能帮助我们以非凡的精准度和创造力实现。',
      howItWorksTitle: '如何使用',
      howItWorksDesc: '我们的平台采用简单透明的积分系统。这种方法确保您只为所用付费，让强大的 AI 编辑变得物有所值。',
      signUp: '注册：创建账户即可开始。',
      purchasePoints: '购买积分：使用我们集成的 Stripe 支付系统安全购买积分。',
      startEditing: '开始编辑：使用您的积分进行编辑，您可以选择我们的预制模板或编写您自己的自定义提示。',
      trackHistory: '跟踪您的历史：从您的控制面板轻松查看您的过往编辑和购买历史。',
      commitmentTitle: '我们的承诺',
      commitmentDesc: '我们对创造力和技术的结合充满热情。我们承诺通过添加新功能、提高性能并为我们的社区确保安全和用户友好的体验，不断改进 AI 图片编辑器。',
      thanks: '感谢您选择 AI 图片编辑器。我们迫不及待想看到您的创作！'
    },
    privacy: {
      title: '隐私政策',
      lastUpdated: '最后更新：2025 年 7 月 25 日',
      intro: 'AI 图片编辑器（“我们”、“我们的”或“我们的服务”）致力于保护您的隐私。本隐私政策解释了我们在您使用我们的应用程序时如何收集、使用、披露和保护您的信息。',
      infoCollectTitle: '我们收集的信息',
      infoCollectDesc: '我们可能以各种方式收集有关您的信息。我们可能在本服务上收集的信息包括：',
      personalData: '个人数据：当您注册账户时，我们收集您的用户名和密码的哈希版本。我们不以明文存储密码。',
      imageData: '图像数据：我们处理您上传的图像以提供编辑服务。上传的图像会发送到我们的后端和 Gemini API 进行处理。我们可能会临时缓存这些图像以提高性能，但我们不会永久存储您的原始或编辑后的图像，除非它是您明确的编辑历史的一部分，该历史与您的账户相关联。',
      paymentData: '支付数据：为了购买积分，您直接向我们的支付处理商 Stripe 提供支付信息。我们不会在我们的服务器上收集或存储您的完整支付卡详细信息。我们只存储有关交易的信息，例如金额和订单状态。',
      usageData: '使用数据：我们可能收集有关您与应用程序交互的信息，例如您使用的功能和您执行的编辑。',
      howWeUseTitle: '我们如何使用您的信息',
      howWeUseDesc: '我们使用我们收集的信息用于：',
      createAccount: '创建和管理您的账户。',
      provideService: '提供、运营和维护我们的应用程序。',
      processTransactions: '处理您的交易并管理您的订单。',
      communicate: '与您沟通，包括客户服务。',
      improveServices: '改进我们的服务并开发新功能。',
      monitorUsage: '监控和分析使用情况和趋势以增强您的体验。',
      securityTitle: '数据安全',
      securityDesc: '我们使用管理、技术和物理安全措施来帮助保护您的个人信息。虽然我们已采取合理的步骤来保护您提供给我们的个人信息，但请注意，尽管我们努力，但没有任何安全措施是完美或不可破坏的，也没有任何数据传输方法可以保证防止任何拦截或其他类型的滥用。',
      thirdPartyTitle: '第三方服务',
      thirdPartyDesc: '我们的服务依赖于第三方服务运行：',
      geminiApi: 'Google Gemini API：您上传的图像和提示会发送到 Gemini API 进行处理。我们鼓励您查看 Google 的隐私政策。',
      stripe: 'Stripe：所有支付都由 Stripe 处理。您的支付信息需遵守 Stripe 的隐私政策。',
      changesTitle: '本政策的更改',
      changesDesc: '我们可能会不时更新本隐私政策。我们将通过在此页面上发布新的隐私政策来通知您任何更改。建议您定期查看本隐私政策以了解任何更改。',
      contactTitle: '联系我们',
      contactDesc: '如果您对本隐私政策有任何疑问，请通过 support.img@255032.xyz 与我们联系。'
    },
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      date: '日期',
      status: '状态',
      completed: '已完成',
      pending: '处理中',
      failed: '失败',
      orderHistory: '订单历史',
      editHistory: '编辑历史',
      imageEditHistory: '图片编辑历史',
      changePassword: '修改密码',
      updatePassword: '更新密码',
      oldPassword: '旧密码',
      newPassword: '新密码',
      confirmNewPassword: '确认新密码',
      passwordTooShort: '新密码必须至少 8 个字符。',
      passwordsNotMatch: '新密码不匹配。',
      passwordChanged: '密码修改成功',
      noOrdersYet: '您还没有订单。',
      noEditsYet: '您还没有编辑过任何图片。',
      pointsDeducted: '扣除积分',
      result: '结果'
    }
  }
};
