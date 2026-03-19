export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 leading-tight">
        DMCA <span className="text-red-600">Notice</span>
      </h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
        prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
        
        <p>NewsSphere respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website at https://www.copyright.gov/legislation/dmca.pdf, we will respond expeditiously to claims of copyright infringement.</p>

        <h2>Reporting Copyright Infringement</h2>
        <p>If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements taking place on or through the site by completing a DMCA Notice of Alleged Infringement and delivering it to NewsSphere's Designated Copyright Agent.</p>

        <p>The notice must include the following information:</p>
        <ul>
          <li>Identify the copyrighted work that you claim has been infringed.</li>
          <li>Identify the material that you claim is infringing and that is to be removed or access to which is to be disabled.</li>
          <li>Provide your contact information: name, address, telephone number, and email address.</li>
          <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
        </ul>

        <h2>Contact Information</h2>
        <p>Notices should be sent to:</p>
        <p>
          Copyright Agent<br />
          NewsSphere Media Group<br />
          123 Media Plaza, New York, NY 10001<br />
          Email: legal@newssphere.com
        </p>

        <h2>Counter-Notification</h2>
        <p>If you receive a notification that your content has been removed due to a copyright complaint, you may send a counter-notification. It must be a written communication that includes substantially the same information as the infringement notice, along with a statement under penalty of perjury that you have a good faith belief that the material was removed as a result of mistake or misidentification.</p>
      </div>
    </div>
  );
}
