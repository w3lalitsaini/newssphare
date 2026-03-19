export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 leading-tight">
        Cookie <span className="text-red-600">Policy</span>
      </h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
        prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
        
        <p>This is the Cookie Policy for NewsSphere, accessible from newssphere.com</p>

        <h2>What Are Cookies</h2>
        <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>

        <h2>How We Use Cookies</h2>
        <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>

        <h2>The Cookies We Set</h2>
        <ul>
          <li><strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration.</li>
          <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
          <li><strong>Newsletters emailing related cookies:</strong> This site offers newsletter or email subscription services and cookies may be used to remember if you are already registered.</li>
        </ul>

        <h2>Third Party Cookies</h2>
        <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
        <ul>
          <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.</li>
          <li>The Google AdSense service we use to serve advertising uses a DoubleClick cookie to serve more relevant ads across the web and limit the number of times that a given ad is shown to you.</li>
        </ul>

        <h2>More Information</h2>
        <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
      </div>
    </div>
  );
}
