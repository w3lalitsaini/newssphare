export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-black uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Join the Team
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
          Work with <span className="text-red-600">Us</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Help us build the future of news. We're looking for passionate journalists, 
          engineers, and designers to join our growing global team.
        </p>
      </div>

      <div className="space-y-8">
        {[
          { title: 'Senior Technology Reporter', type: 'Full-time', location: 'Remote / New York', dept: 'Editorial' },
          { title: 'Content Strategist', type: 'Full-time', location: 'London', dept: 'Marketing' },
          { title: 'Fullstack Next.js Engineer', type: 'Full-time', location: 'Remote', dept: 'Engineering' },
          { title: 'UI/UX Designer', type: 'Contract', location: 'Remote', dept: 'Design' }
        ].map((job, i) => (
          <div key={i} className="group bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-red-100 dark:hover:border-red-900/30 transition-all cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2">{job.dept}</div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors mb-2">{job.title}</h3>
                <div className="flex gap-4 text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>{job.type}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full my-auto"></span>
                  <span>{job.location}</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-6">Don't see a role that fits? Send us your resume anyway!</p>
        <a href="mailto:careers@newssphere.com" className="text-red-600 font-black uppercase tracking-widest text-sm hover:underline">jobs@newssphere.com</a>
      </div>
    </div>
  );
}
