import { Globe, Target, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-black uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Our Story
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
          About <span className="text-red-600">NewsSphere</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          We are more than just a news site. we are a global community dedicated to 
          uncovering the truth and providing insightful analysis on the topics that matter most.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            At NewsSphere, our mission is to empower our readers with accurate, timely, and unbiased information. 
            We believe that a well-informed public is the cornerstone of a healthy society, and we strive 
            to be the most trusted source of news in the digital age.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our team of dedicated journalists and analysts work around the clock to bring you 
            comprehensive coverage of technology, business, politics, and culture from every corner of the globe.
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900 rounded-[2rem] p-8 flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-xl">
                    <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">EST. 2024</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-gray-100 dark:border-gray-800 pt-16">
        {[
          { icon: Target, title: 'Unbiased', desc: 'Committed to reporting the facts without agenda.' },
          { icon: Users, title: 'Global', desc: 'Coverage from every continent and culture.' },
          { icon: Award, title: 'Excellence', desc: 'Award-winning journalism and deep analysis.' }
        ].map((item, i) => (
          <div key={i} className="space-y-4">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto">
              <item.icon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-black uppercase tracking-widest text-sm text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
