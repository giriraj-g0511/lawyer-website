# Sterling Legal Partners - Law Firm Website

A modern, professional, and trustworthy static website for a law firm. Built with vanilla HTML, CSS, and JavaScript for fast loading and easy deployment.

## Features

- **Design**: Minimal, elegant, professional with navy blue, dark green, charcoal, white, and gold accents
- **Typography**: Cormorant Garamond (serif) for headings, Source Sans 3 (sans-serif) for body
- **Animations**: Scroll-based fade-ins, hover effects, testimonial slider, counter animation
- **Sections**: Hero, About, Practice Areas, Why Choose Us, Testimonials, Contact
- **Contact Form**: PHP backend with MySQL/MariaDB database storage, automatic email to admin on submission
- **Responsive**: Fully responsive for mobile, tablet, and desktop
- **Accessible**: Skip links, ARIA labels, semantic HTML, proper contrast

## Setup

### 1. Contact Form (PHP + Database)

The contact form saves submissions to a MySQL/MariaDB database and sends an email notification to the admin.

**Step 1 – Create the database and table**

Run the SQL file in your MySQL client (phpMyAdmin, MySQL Workbench, or command line):

```bash
mysql -u root -p < database/contact.sql
```

Or copy the contents of `database/contact.sql` and run them in your database.

**Step 2 – Configure database connection**

Edit `config/database.php` with your database credentials:

```php
define('DB_HOST', 'localhost');   // Database host
define('DB_NAME', 'sterling_legal');
define('DB_USER', 'root');        // Your MySQL username
define('DB_PASS', '');            // Your MySQL password
define('ADMIN_EMAIL', 'info@sterlinglegal.com');  // Email to receive form submissions
```

**Step 3 – Run with PHP**

Use a PHP-enabled web server (XAMPP, WAMP, Laragon, or PHP built-in server):

```bash
php -S localhost:8000
```

Then visit `http://localhost:8000`

**Email notes:** Form submissions automatically send an email to `ADMIN_EMAIL`. PHP's `mail()` function requires the server to have mail configured (SMTP/sendmail). On shared hosting this usually works; on local development you may need to configure a mail server or use a tool like Mailtrap for testing.

### 2. Optional: Customize Map

The embedded Google Map points to a sample location. To use your own:

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your address and click "Share" → "Embed a map"
3. Copy the `src` URL from the iframe
4. Replace the iframe `src` in the Contact section of `index.html`

### 3. Run Locally

Open `index.html` in a browser, or use a simple local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`

## Project Structure

```
DemoWebsite/
├── index.html         # Main HTML
├── api/
│   └── contact.php    # Contact form handler
├── config/
│   └── database.php   # Database configuration
├── css/
│   └── styles.css     # All styles
├── database/
│   └── contact.sql    # Database schema
├── js/
│   └── main.js        # Navigation, animations, form handling
└── README.md
```

## Customization

- **Colors**: Edit CSS variables in `:root` in `css/styles.css`
- **Content**: Update text, addresses, and contact info in `index.html`
- **Firm name**: Search and replace "Sterling Legal" across files

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). Uses Intersection Observer and fetch API.

## License

Use freely for your law firm or client projects.
