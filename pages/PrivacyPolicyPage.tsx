import React from 'react';
import Card from '../components/ui/Card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="prose prose-invert max-w-none text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
          <p>Last updated: July 25, 2025</p>

          <p>
            AI Image Editor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> When you register for an account, we collect your username and a hashed version of your password. We do not store passwords in plain text.</li>
            <li><strong>Image Data:</strong> We process the images you upload to provide the editing service. Uploaded images are sent to our backend and the Gemini API for processing. We may temporarily cache these images to improve performance, but we do not permanently store your original or edited images unless it's part of your explicit edit history, which is tied to your account.</li>
            <li><strong>Payment Data:</strong> To purchase points, you provide payment information directly to our payment processor, Stripe. We do not collect or store your full payment card details on our servers. We only store information about the transaction, such as the amount and order status.</li>
            <li><strong>Usage Data:</strong> We may collect information about your interactions with the application, such as the features you use and the edits you perform.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Provide, operate, and maintain our application.</li>
            <li>Process your transactions and manage your orders.</li>
            <li>Communicate with you, including for customer service.</li>
            <li>Improve our services and develop new features.</li>
            <li>Monitor and analyze usage and trends to enhance your experience.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Third-Party Services</h2>
          <p>
            Our service relies on third-party services to function:
          </p>
          <ul>
            <li><strong>Google Gemini API:</strong> Your uploaded images and prompts are sent to the Gemini API for processing. We encourage you to review Google's privacy policy.</li>
            <li><strong>Stripe:</strong> All payments are processed by Stripe. Your payment information is subject to Stripe's privacy policy.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support.img@255032.xyz.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
