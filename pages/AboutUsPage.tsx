import React from 'react';
import Card from '../components/ui/Card';

const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="prose prose-invert max-w-none text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-4">About AI Image Editor</h1>
          
          <p>
            Welcome to AI Image Editor, your go-to platform for transforming your images with the power of artificial intelligence. Our mission is to provide an intuitive, powerful, and accessible tool that empowers everyone—from casual users to creative professionals—to edit their images in magical new ways.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Our Technology</h2>
          <p>
            At the heart of our editor is Google's state-of-the-art Gemini API. This cutting-edge technology allows us to interpret complex text prompts and apply stunning, high-quality edits to your photos. Whether you want to change the season in a landscape, add a fantastical creature to a portrait, or simply enhance colors, Gemini helps us make it happen with remarkable precision and creativity.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-6 mb-3">How It Works</h2>
          <p>
            Our platform operates on a simple and transparent points-based system. This approach ensures you only pay for what you use, making powerful AI editing affordable.
          </p>
          <ul>
            <li><strong>Sign Up:</strong> Create an account to get started.</li>
            <li><strong>Purchase Points:</strong> Securely buy points using our Stripe-integrated payment system.</li>
            <li><strong>Start Editing:</strong> Use your points to perform edits, either by choosing one of our pre-made templates or by writing your own custom prompts.</li>
            <li><strong>Track Your History:</strong> Easily view your past edits and purchase history right from your dashboard.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-6 mb-3">Our Commitment</h2>
          <p>
            We are passionate about the intersection of creativity and technology. We are committed to continuously improving the AI Image Editor by adding new features, enhancing performance, and ensuring a secure and user-friendly experience for our community.
          </p>
          
          <p>
            Thank you for choosing AI Image Editor. We can't wait to see what you create!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AboutUsPage;
