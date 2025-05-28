import React from 'react';
import { Link } from 'react-router-dom';

const Experiences: React.FC = () => {
  const experiences = [
    {
      id: 'wingo-wednesday',
      title: 'WINGO Wednesdays',
      date: 'Wednesday, May 28, 2025',
      location: 'Wingate Track, Brooklyn',
      description: (
        <>
          Run, walk, sprint, limp, plank, wheel, or just hang out. Get a custom workout from Coach DAISY™ and earn{' '}
          <span className="inline-flex items-center">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>. Free
        </>
      ),
      image: '/wingate1.jpg',
      link: '/wingo-wednesday'
    },
    {
      id: 'wingate-invitational',
      title: 'Wingate Invitational',
      date: 'Sunday, September 7, 2025 at 7:20 AM',
      location: 'Wingate Track, Brooklyn',
      description: (
        <>
          Definitely not a mile and definitely not sold out. {' '}
          <span className="inline-flex items-center">
          </span>
        </>
      ),
      image: '/wingatebw1.jpg',
      link: '/wingate-invitational'
    },
    {
      id: '320-day',
      title: '320 Day',
      date: 'Friday, March 20, 2026',
      location: 'Wingate Track, Brooklyn',
      description: 'The most important day of the year.',
      image: '/320day.jpeg',
      link: '/320-day'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Upcoming</span>
            <span className="block text-wingo-600">Experiences</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Find your kick with Coach DAISY™ and the 320 Track Club.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {experiences.map((experience) => (
            <div key={experience.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={experience.image}
                    alt={experience.title}
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-wingo-600 font-semibold">
                    {experience.date}
                  </div>
                  <Link
                    to={experience.link}
                    className="mt-1 text-xl leading-7 font-semibold text-gray-900 hover:text-wingo-600"
                  >
                    {experience.title}
                  </Link>
                  <p className="mt-2 text-gray-500">
                    {experience.location}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {experience.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={experience.link}
                      className="text-wingo-600 hover:text-wingo-500 font-medium"
                    >
                      Learn more
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experiences; 