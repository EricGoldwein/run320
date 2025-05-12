import React from 'react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const events = [
    {
      id: 'wingate-invitational',
      title: 'Wingate Invitational',
      date: 'September 7, 2025',
      location: 'Wingate Track, Brooklyn',
      description: 'The inaugural track meet at the historic Wingate Track. Registration: 5 $WINGO',
      image: '/wingate1.jpg',
      link: '/wingate-invitational'
    },
    {
      id: '320-day',
      title: '320 Day',
      date: 'March 20, 2026',
      location: 'Wingate Track, Brooklyn',
      description: 'The most important day of the year.',
      image: '/wingatebw1.jpg',
      link: '/320-day'
    },
    {
      id: 'wingo-wednesday',
      title: 'WINGO Wednesdays',
      date: 'Biweekly (see schedule)',
      location: 'Wingate Track, Brooklyn',
      description: 'Walk, Run, Sprint, or just hang out. Get a custom workout from Coach DAISY™ and earn WINGO. Open to all abilities. No registration required.',
      image: '/wingowednesday.jpg',
      link: '/wingo-wednesday'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Upcoming</span>
            <span className="block text-wingo-600">Events</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Find your kick at the next 320 Track Club competition.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {events.map((event) => (
            <div key={event.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={event.image}
                    alt={event.title}
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-wingo-600 font-semibold">
                    {event.date}
                  </div>
                  <Link
                    to={event.link}
                    className="mt-1 text-xl leading-7 font-semibold text-gray-900 hover:text-wingo-600"
                  >
                    {event.title}
                  </Link>
                  <p className="mt-2 text-gray-500">
                    {event.location}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {event.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={event.link}
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

export default Events; 