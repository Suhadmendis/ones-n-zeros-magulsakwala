<?php
// CLI only: php seed_content.php
require __DIR__ . '/db.php';

$pdo = db_connect();
ensure_schema($pdo);

$rows = [
    // ---- home / hero ----
    ['home', 'hero', 'eyebrow_steps', 'In 3 easy steps'],
    ['home', 'hero', 'steps_subtitle', 'Register, get reviewed, meet with confidence.'],
    ['home', 'hero', 'step_1', 'Register'],
    ['home', 'hero', 'step_2', 'Private Review'],
    ['home', 'hero', 'step_3', 'Introduction'],
    ['home', 'hero', 'headline', 'Find a match built on trust, not browsing.'],
    ['home', 'hero', 'subtext', 'Magul Sakwala is a private, curated introduction service. Register once — our team handles the rest, quietly and carefully.'],
    ['home', 'hero', 'cta_register', 'Register'],
    ['home', 'hero', 'cta_start_now', 'Start now'],

    // ---- home / welcome ----
    ['home', 'welcome', 'greeting', 'Welcome!...'],
    ['home', 'welcome', 'lede', 'A private path to marriage, built on trust.'],
    ['home', 'welcome', 'body', 'Magul Sakwala is a private, curated introduction service for people across Sri Lanka and abroad who are serious about marriage. Every profile is reviewed personally by our team before anyone is introduced — no public browsing, no swiping, no strangers reaching out uninvited. Your photos, contact details, and personal information are only ever shared once both sides have agreed.'],
    ['home', 'welcome', 'cta', 'Start Your Journey'],

    // ---- home / trust ----
    ['home', 'trust', 'heading', 'Why families trust us'],
    ['home', 'trust', 'card_1_title', 'Private'],
    ['home', 'trust', 'card_1_body', 'Your details are never shown publicly. Only our team reviews your profile.'],
    ['home', 'trust', 'card_2_title', 'Curated'],
    ['home', 'trust', 'card_2_body', 'Every match is reviewed by hand — no algorithm swiping, no browsing strangers.'],
    ['home', 'trust', 'card_3_title', 'No Public Profiles'],
    ['home', 'trust', 'card_3_body', 'Nothing you submit is searchable, listed, or visible to other members.'],

    // ---- home / members ----
    ['home', 'members', 'heading', 'Members welcomed from every district'],

    // ---- home / teaser ----
    ['home', 'teaser', 'heading', 'How it works'],
    ['home', 'teaser', 'body', 'Register → private review → we contact both sides → mutual consent → introduction. No public browsing, ever.'],
    ['home', 'teaser', 'cta', 'See the full process'],

    // ---- how-it-works / intro ----
    ['how-it-works', 'intro', 'heading', 'How It Works'],
    ['how-it-works', 'intro', 'subtext', 'A private, five-step process — no public browsing, no swiping, no pressure.'],

    // ---- how-it-works / steps ----
    ['how-it-works', 'steps', 'step_1_title', 'Register'],
    ['how-it-works', 'steps', 'step_1_body', 'Fill in your details privately — name, contact info, and the basics. Nothing is shown publicly.'],
    ['how-it-works', 'steps', 'step_2_title', 'Private Review'],
    ['how-it-works', 'steps', 'step_2_body', 'Our team reviews your profile carefully before anyone else sees it.'],
    ['how-it-works', 'steps', 'step_3_title', 'We Contact Both Sides'],
    ['how-it-works', 'steps', 'step_3_body', 'When we find a potential match, we reach out to you and the other side separately.'],
    ['how-it-works', 'steps', 'step_4_title', 'Mutual Consent'],
    ['how-it-works', 'steps', 'step_4_body', 'Nothing moves forward until both sides agree to be introduced.'],
    ['how-it-works', 'steps', 'step_5_title', 'Introduction'],
    ['how-it-works', 'steps', 'step_5_body', 'Once both sides consent, we make the introduction and step back.'],

    // ---- how-it-works / cta ----
    ['how-it-works', 'cta', 'heading', 'Ready to begin?'],
    ['how-it-works', 'cta', 'cta_register', 'Register'],

    // ---- register / intro ----
    ['register', 'intro', 'heading', 'Register'],
    ['register', 'intro', 'subtext', 'Private and confidential. Only our team reviews what you submit — nothing is published or searchable.'],

    // ---- register / form ----
    ['register', 'form', 'label_name', 'Name *'],
    ['register', 'form', 'label_email', 'Email *'],
    ['register', 'form', 'label_gender', 'Gender *'],
    ['register', 'form', 'option_select', 'Select'],
    ['register', 'form', 'option_female', 'Female'],
    ['register', 'form', 'option_male', 'Male'],
    ['register', 'form', 'label_dob', 'Date of Birth *'],
    ['register', 'form', 'label_district', 'District *'],
    ['register', 'form', 'label_birth_time', 'Birth Time (optional)'],
    ['register', 'form', 'label_photo', 'Profile Photo (optional)'],
    ['register', 'form', 'btn_submit', 'Submit'],
    ['register', 'form', 'btn_submitting', 'Submitting…'],
    ['register', 'form', 'err_generic', 'Something went wrong. Please try again.'],
    ['register', 'form', 'err_network', 'Could not reach the server. Please try again.'],

    // ---- register / form validation ----
    ['register', 'form_errors', 'name_required', 'Name is required.'],
    ['register', 'form_errors', 'email_required', 'Email is required.'],
    ['register', 'form_errors', 'email_invalid', 'Enter a valid email address.'],
    ['register', 'form_errors', 'gender_required', 'Gender is required.'],
    ['register', 'form_errors', 'dob_required', 'Date of birth is required.'],
    ['register', 'form_errors', 'dob_min_age', 'You must be at least 18 years old.'],
    ['register', 'form_errors', 'dob_invalid', 'Enter a valid date of birth.'],
    ['register', 'form_errors', 'district_required', 'District is required.'],

    // ---- thank-you / main ----
    ['thank-you', 'main', 'heading', 'Thank you for registering'],
    ['thank-you', 'main', 'body_1', "We've received your details privately. Nothing you submitted is public or searchable."],
    ['thank-you', 'main', 'body_2', "Our team will review your profile by hand. If we find a potential match, we'll contact you directly before sharing anything with the other side."],
    ['thank-you', 'main', 'note', 'No further action is needed from you right now.'],
    ['thank-you', 'main', 'cta', 'Back to Home'],

    // ---- privacy-trust / intro ----
    ['privacy-trust', 'intro', 'heading', 'Privacy & Trust'],
    ['privacy-trust', 'intro', 'subtext', "Everything about Magul Sakwala is built around discretion. Here's exactly how we protect your information."],

    // ---- privacy-trust / principles ----
    ['privacy-trust', 'principles', 'card_1_title', 'No Public Browsing'],
    ['privacy-trust', 'principles', 'card_1_body', 'There is no member directory, no public profiles, and no browsing. Your details are never listed or searchable by anyone — including other members.'],
    ['privacy-trust', 'principles', 'card_2_title', 'Approval Before Contact'],
    ['privacy-trust', 'principles', 'card_2_body', 'Nobody is contacted without our review first. When we find a potential match, we reach out to both sides separately and only proceed once both have agreed. See How It Works for the full process.'],
    ['privacy-trust', 'principles', 'card_3_title', 'Data Handling'],
    ['privacy-trust', 'principles', 'card_3_body', 'Your information is stored in a private database accessible only to our team. We never sell, share, or publish your details to third parties.'],

    // ---- contact-faq / intro ----
    ['contact-faq', 'intro', 'heading', 'Contact / FAQ'],
    ['contact-faq', 'intro', 'subtext', 'Answers to the questions we hear most, plus a direct line to us.'],

    // ---- contact-faq / faqs ----
    ['contact-faq', 'faqs', 'q1', 'Who runs this?'],
    ['contact-faq', 'faqs', 'a1', 'Magul Sakwala is run by a small private team — not an open platform or public company. Every profile is reviewed personally, by hand.'],
    ['contact-faq', 'faqs', 'q2', 'Is it free?'],
    ['contact-faq', 'faqs', 'a2', 'Registration and profile review are free. [Placeholder — confirm final pricing with client before launch.]'],
    ['contact-faq', 'faqs', 'q3', 'How long until I hear back?'],
    ['contact-faq', 'faqs', 'a3', 'Every profile is reviewed by hand, so timing varies. [Placeholder — confirm typical turnaround with client before launch.]'],

    // ---- contact-faq / contact ----
    ['contact-faq', 'contact', 'heading', 'Still have a question?'],
    ['contact-faq', 'contact', 'subtext', "Reach out directly and we'll get back to you."],
    ['contact-faq', 'contact', 'email', 'hello@magulsakwala.lk'],

    // ---- header / nav ----
    ['header', 'nav', 'logo', 'Magul Sakwala'],
    ['header', 'nav', 'link_home', 'Home'],
    ['header', 'nav', 'link_how_it_works', 'How It Works'],
    ['header', 'nav', 'link_privacy_trust', 'Privacy & Trust'],
    ['header', 'nav', 'link_contact_faq', 'Contact / FAQ'],
    ['header', 'nav', 'cta_register', 'Register'],
    ['header', 'nav', 'menu_open', 'Open menu'],
    ['header', 'nav', 'menu_close', 'Close menu'],
    ['header', 'nav', 'link_sign_in', 'Sign In'],
    ['header', 'nav', 'cta_sign_out', 'Sign Out'],

    // ---- auth / signup ----
    ['auth', 'signup', 'heading', 'Create your account'],
    ['auth', 'signup', 'subtext', 'Join Magul Sakwala to save and manage your matches.'],
    ['auth', 'signup', 'label_name', 'Full name'],
    ['auth', 'signup', 'label_email', 'Email'],
    ['auth', 'signup', 'label_password', 'Password'],
    ['auth', 'signup', 'btn_submit', 'Create account'],
    ['auth', 'signup', 'btn_submitting', 'Creating account…'],
    ['auth', 'signup', 'divider_text', 'or'],
    ['auth', 'signup', 'switch_prompt', 'Already have an account?'],
    ['auth', 'signup', 'switch_link', 'Sign in'],

    // ---- auth / signin ----
    ['auth', 'signin', 'heading', 'Welcome back'],
    ['auth', 'signin', 'subtext', 'Sign in to continue to your account.'],
    ['auth', 'signin', 'label_email', 'Email'],
    ['auth', 'signin', 'label_password', 'Password'],
    ['auth', 'signin', 'btn_submit', 'Sign in'],
    ['auth', 'signin', 'btn_submitting', 'Signing in…'],
    ['auth', 'signin', 'divider_text', 'or'],
    ['auth', 'signin', 'switch_prompt', "Don't have an account?"],
    ['auth', 'signin', 'switch_link', 'Sign up'],

    // ---- auth / form validation ----
    ['auth', 'form_errors', 'name_required', 'Please enter your name.'],
    ['auth', 'form_errors', 'email_required', 'Please enter your email.'],
    ['auth', 'form_errors', 'email_invalid', 'Please enter a valid email address.'],
    ['auth', 'form_errors', 'email_taken', 'An account with this email already exists.'],
    ['auth', 'form_errors', 'password_required', 'Please enter a password.'],
    ['auth', 'form_errors', 'password_min_length', 'Password must be at least 8 characters.'],
    ['auth', 'form_errors', 'invalid_credentials', 'Incorrect email or password.'],
    ['auth', 'form_errors', 'google_verify_failed', 'Google sign-in failed. Please try again.'],
    ['auth', 'form_errors', 'err_generic', 'Something went wrong. Please try again.'],

    // ---- footer / info ----
    ['footer', 'info', 'label_address', 'Address'],
    ['footer', 'info', 'address', '[Address — client to provide]'],
    ['footer', 'info', 'label_email', 'Email'],
    ['footer', 'info', 'label_hotline', 'Hotline'],
    ['footer', 'info', 'hotline', '[Phone — client to provide]'],
    ['footer', 'info', 'help_text', 'Need help?'],
    ['footer', 'info', 'help_cta', 'Contact Us'],

    // ---- footer / brand ----
    ['footer', 'brand', 'wordmark', 'Magul Sakwala'],
    ['footer', 'brand', 'tagline', 'A private, trusted introduction service for Sri Lankan families.'],
    ['footer', 'brand', 'copyright', 'Magul Sakwala © {year}. All rights reserved.'],

    // ---- footer / nav ----
    ['footer', 'nav', 'link_home', 'Home'],
    ['footer', 'nav', 'link_how_it_works', 'How It Works'],
    ['footer', 'nav', 'link_privacy_trust', 'Privacy & Trust'],
    ['footer', 'nav', 'link_register', 'Register'],
    ['footer', 'nav', 'link_contact_faq', 'Contact / FAQ'],

    // ---- global / districts ----
    ['global', 'districts', 'ampara', 'Ampara'],
    ['global', 'districts', 'anuradhapura', 'Anuradhapura'],
    ['global', 'districts', 'badulla', 'Badulla'],
    ['global', 'districts', 'batticaloa', 'Batticaloa'],
    ['global', 'districts', 'colombo', 'Colombo'],
    ['global', 'districts', 'galle', 'Galle'],
    ['global', 'districts', 'gampaha', 'Gampaha'],
    ['global', 'districts', 'hambantota', 'Hambantota'],
    ['global', 'districts', 'jaffna', 'Jaffna'],
    ['global', 'districts', 'kalutara', 'Kalutara'],
    ['global', 'districts', 'kandy', 'Kandy'],
    ['global', 'districts', 'kegalle', 'Kegalle'],
    ['global', 'districts', 'kilinochchi', 'Kilinochchi'],
    ['global', 'districts', 'kurunegala', 'Kurunegala'],
    ['global', 'districts', 'mannar', 'Mannar'],
    ['global', 'districts', 'matale', 'Matale'],
    ['global', 'districts', 'matara', 'Matara'],
    ['global', 'districts', 'monaragala', 'Monaragala'],
    ['global', 'districts', 'mullaitivu', 'Mullaitivu'],
    ['global', 'districts', 'nuwara_eliya', 'Nuwara Eliya'],
    ['global', 'districts', 'polonnaruwa', 'Polonnaruwa'],
    ['global', 'districts', 'puttalam', 'Puttalam'],
    ['global', 'districts', 'ratnapura', 'Ratnapura'],
    ['global', 'districts', 'trincomalee', 'Trincomalee'],
    ['global', 'districts', 'vavuniya', 'Vavuniya'],
];

$stmt = $pdo->prepare(
    'INSERT INTO content (page, section, `key`, content_en)
     VALUES (:page, :section, :key, :content_en)
     ON DUPLICATE KEY UPDATE content_en = VALUES(content_en)'
);

foreach ($rows as [$page, $section, $key, $contentEn]) {
    $stmt->execute([
        ':page' => $page,
        ':section' => $section,
        ':key' => $key,
        ':content_en' => $contentEn,
    ]);
}

echo 'Seeded ' . count($rows) . " content rows.\n";
