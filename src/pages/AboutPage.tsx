import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bigIslandYus from '../assets/Big Island Yus.jpg';
import aboutTeam from '../assets/illustrations/about-team.svg';
import fullKailaniLogo from '../assets/Full Kailani logo.png';
import familyImage from '../assets/Family.jpg';

const AboutPage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f0c91f]">
      <section className="relative h-80 w-full overflow-hidden rounded-b-3xl bg-[#19b4bd] shadow-md md:h-96">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <img
                src={familyImage}
                alt="Kailani Family"
                className="h-48 w-72 rounded-2xl border-4 border-white/20 object-cover shadow-lg transition-transform duration-300 hover:scale-105 md:h-52 md:w-80"
              />
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="baloo-regular mb-2 max-w-full text-3xl font-bold drop-shadow-lg sm:text-4xl md:text-6xl">
            Our Story
          </h1>
          <p className="baloo-regular max-w-xl px-4 text-lg font-light drop-shadow-md sm:text-xl md:text-2xl">
            The journey, passion, and people behind Kailani
          </p>
        </div>
      </section>

      <main className="w-full max-w-full overflow-x-hidden bg-[#f0c91f] px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <nav
            aria-label="About tabs"
            className="mb-8 flex w-full justify-center"
          >
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="flex max-w-full flex-wrap justify-center gap-2 rounded-2xl bg-gray-100 p-2"
            >
              <button
                role="tab"
                id="tab-story"
                aria-controls="panel-story"
                aria-selected={activeTab === 'story'}
                tabIndex={activeTab === 'story' ? 0 : -1}
                onClick={() => setActiveTab('story')}
                className={`baloo-regular cursor-pointer rounded-2xl px-4 py-3 text-sm font-bold shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-6 sm:text-base ${
                  activeTab === 'story'
                    ? 'bg-amber-500 text-white ring-amber-700'
                    : 'text-[#000000] hover:bg-gray-200 focus-visible:ring-gray-900'
                }`}
              >
                Our Story
              </button>
              <button
                role="tab"
                id="tab-team"
                aria-controls="panel-team"
                aria-selected={activeTab === 'team'}
                tabIndex={activeTab === 'team' ? 0 : -1}
                onClick={() => setActiveTab('team')}
                className={`baloo-regular cursor-pointer rounded-2xl px-4 py-3 text-sm font-bold shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-6 sm:text-base ${
                  activeTab === 'team'
                    ? 'bg-cyan-500 text-white ring-cyan-700'
                    : 'text-[#000000] hover:bg-gray-200 focus-visible:ring-gray-900'
                }`}
              >
                Our Team
              </button>
              <button
                role="tab"
                id="tab-values"
                aria-controls="panel-values"
                aria-selected={activeTab === 'values'}
                tabIndex={activeTab === 'values' ? 0 : -1}
                onClick={() => setActiveTab('values')}
                className={`baloo-regular cursor-pointer rounded-2xl px-4 py-3 text-sm font-bold shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-6 sm:text-base ${
                  activeTab === 'values'
                    ? 'bg-purple-500 text-white ring-purple-700'
                    : 'text-[#000000] hover:bg-gray-200 focus-visible:ring-gray-900'
                }`}
              >
                Our Values
              </button>
            </div>
          </nav>

          <section className="mx-auto w-full max-w-4xl overflow-x-hidden pb-16">
            {activeTab === 'story' && (
              <section
                id="panel-story"
                role="tabpanel"
                aria-labelledby="tab-story"
                className="w-full"
              >
                <div className="mb-12 grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
                  <div className="flex w-full justify-center">
                    <img
                      src={bigIslandYus}
                      alt="Big Island Yus"
                      className="h-64 w-64 rounded-full border-4 border-white object-cover shadow-xl transition-transform duration-300 hover:scale-105 md:h-80 md:w-80"
                    />
                  </div>
                  <div className="w-full min-w-0">
                    <h2 className="baloo-regular relative mb-4 inline-block pb-2 text-2xl font-bold text-[#002B5B] sm:text-3xl">
                      How It All Began
                      <span
                        className="absolute bottom-0 left-0 h-2 w-full rounded bg-amber-100"
                        aria-hidden="true"
                      />
                    </h2>
                    <p className="mb-4 text-[#000000]">
                      Kailani was born from a deep love of Hawaiian and Pacific
                      cuisine. Our founder, Chef Miriam and Chef Steven, grew up
                      on the shores of Oahu where food was always at the center
                      of family gatherings.
                    </p>
                    <p className="mb-4 text-[#000000]">
                      In 2015, after years of working in top restaurants across
                      the country, Chef Kai decided to bring the flavors of home
                      to the mainland with a modern twist.
                    </p>
                    <div className="rounded-2xl border-l-4 border-cyan-500 bg-cyan-50 p-4">
                      <p className="text-gray-700 italic">
                        Food is a universal language that brings people
                        together. At Kailani, we want to share the aloha spirit
                        through our dishes.
                      </p>
                      <p className="mt-2 font-bold text-gray-800">
                        — Chef Miriam, Founder
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="baloo-regular relative mb-8 inline-block pb-2 text-center text-2xl font-bold text-[#002B5B] sm:text-3xl">
                    Our Journey
                    <span
                      className="absolute bottom-0 left-0 h-2 w-full rounded bg-amber-100"
                      aria-hidden="true"
                    />
                  </h2>
                  <div className="relative w-full">
                    <div
                      className="absolute left-1/2 z-0 h-full w-px -translate-x-1/2 bg-amber-100"
                      aria-hidden="true"
                    />
                    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="relative md:col-start-2">
                        <div
                          className="absolute top-6 -left-10 z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-amber-500 md:block"
                          aria-hidden="true"
                        />
                        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm transition hover:shadow-md">
                          <h3 className="baloo-regular mb-1 text-xl font-bold text-amber-600">
                            2015
                          </h3>
                          <h4 className="baloo-regular mb-2 text-lg font-bold text-gray-800">
                            First Pop-up
                          </h4>
                          <p className="text-[#333333]">
                            Kailani started as a weekend pop-up at local
                            farmers' markets, serving Hawaiian-inspired street
                            food.
                          </p>
                        </article>
                      </div>

                      <div className="hidden md:block" aria-hidden="true" />

                      <div className="relative md:col-start-1 md:text-right">
                        <div
                          className="absolute top-6 -right-10 z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-cyan-500 md:block"
                          aria-hidden="true"
                        />
                        <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm transition hover:shadow-md">
                          <h3 className="baloo-regular mb-1 text-xl font-bold text-cyan-600">
                            2017
                          </h3>
                          <h4 className="baloo-regular mb-2 text-lg font-bold text-gray-800">
                            Food Truck Launch
                          </h4>
                          <p className="text-gray-700">
                            After gaining popularity, we expanded with our first
                            food truck, "Kailani On Wheels".
                          </p>
                        </article>
                      </div>

                      <div className="relative md:col-start-2">
                        <div
                          className="absolute top-6 -left-10 z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-purple-500 md:block"
                          aria-hidden="true"
                        />
                        <article className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm transition hover:shadow-md">
                          <h3 className="baloo-regular mb-1 text-xl font-bold text-purple-600">
                            2020
                          </h3>
                          <h4 className="baloo-regular mb-2 text-lg font-bold text-gray-800">
                            Pivoting Through Challenges
                          </h4>
                          <p className="text-gray-700">
                            During the pandemic, we adapted with a successful
                            meal kit delivery service, bringing Hawaiian flavors
                            to homes.
                          </p>
                        </article>
                      </div>

                      <div className="hidden md:block" aria-hidden="true" />

                      <div className="relative md:col-start-1 md:text-right">
                        <div
                          className="absolute top-6 -right-10 z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-green-500 md:block"
                          aria-hidden="true"
                        />
                        <article className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm transition hover:shadow-md">
                          <h3 className="baloo-regular mb-1 text-xl font-bold text-green-600">
                            2022
                          </h3>
                          <h4 className="baloo-regular mb-2 text-lg font-bold text-gray-800">
                            Restaurant Opening
                          </h4>
                          <p className="text-gray-700">
                            We finally opened our first brick-and-mortar
                            location, bringing the full Kailani experience to
                            life.
                          </p>
                        </article>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#78350F] p-8 text-center shadow-lg">
                  <h3 className="baloo-regular mb-4 text-2xl font-bold text-[#F5E1A4]">
                    Come Be Part of Our Story!
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-[#FFFFF0]">
                    We're continually growing and would love for you to join us
                    on this journey.
                  </p>
                  <a
                    href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open directions to Kailani in a new tab"
                    className="baloo-regular cursor-pointer rounded-2xl bg-white px-6 py-3 text-lg font-bold text-[#000000] shadow-[0_6px_0_rgb(186,183,201)] transition hover:translate-y-1 hover:scale-105 hover:shadow-[0_4px_0px_rgb(186,183,201)] focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
                  >
                    Visit Us Today
                  </a>
                </div>
              </section>
            )}

            {activeTab === 'team' && (
              <section
                id="panel-team"
                role="tabpanel"
                aria-labelledby="tab-team"
                className="w-full max-w-full overflow-x-hidden"
              >
                <div className="mb-12 grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
                  <div className="w-full min-w-0">
                    <h2 className="baloo-regular relative mb-4 inline-block pb-2 text-2xl font-bold sm:text-3xl">
                      Meet Our Ohana
                      <span
                        className="absolute bottom-0 left-0 h-2 w-full rounded bg-cyan-200"
                        aria-hidden="true"
                      />
                    </h2>
                    <p className="mb-4 text-[#002B5B]">
                      At Kailani, we're more than just colleagues – we're a
                      family (ohana). Our diverse team brings together talents
                      from various backgrounds, united by our passion for great
                      food and aloha spirit.
                    </p>
                    <p className="mb-6 text-[#002B5B]">
                      From our kitchen staff to our servers, each team member
                      plays a crucial role in creating the warm, welcoming
                      experience that defines Kailani.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 flex-shrink-0 rounded-full bg-cyan-500"
                          aria-hidden="true"
                        />
                        <span className="font-bold text-gray-800">
                          5+ Team Members
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 flex-shrink-0 rounded-full bg-amber-500"
                          aria-hidden="true"
                        />
                        <span className="font-bold text-gray-800">
                          5+ Nationalities
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 flex-shrink-0 rounded-full bg-purple-500"
                          aria-hidden="true"
                        />
                        <span className="font-bold text-gray-800">
                          100% Passionate About Food
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-full">
                    <img
                      src={aboutTeam}
                      alt="Illustration of our team"
                      className="mx-auto w-full max-w-sm"
                    />
                  </div>
                </div>

                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="baloo-regular relative mb-8 inline-block pb-2 text-center text-2xl font-bold sm:text-3xl">
                    Key Team Members
                    <span
                      className="absolute bottom-0 left-0 h-2 w-full rounded bg-cyan-200"
                      aria-hidden="true"
                    />
                  </h2>
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                    <article className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm transition hover:shadow-md">
                      <div className="h-3 bg-amber-500" aria-hidden="true" />
                      <div className="p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                            />
                          </svg>
                        </div>
                        <h3 className="baloo-regular mb-1 text-center text-xl font-bold">
                          Chef Miriam
                        </h3>
                        <p className="mb-4 text-center text-amber-600">
                          Founder & Head Chef
                        </p>
                        <p className="text-center text-gray-700">
                          Born and raised in Hawaii, Chef Kai brings authentic
                          island flavors with a modern twist to every dish.
                        </p>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-sm transition hover:shadow-md">
                      <div className="h-3 bg-cyan-500" aria-hidden="true" />
                      <div className="p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-cyan-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="baloo-regular mb-1 text-center text-xl font-bold">
                          Steven
                        </h3>
                        <p className="mb-4 text-center text-cyan-600">
                          Restaurant Manager
                        </p>
                        <p className="text-center text-gray-700">
                          With 10+ years in hospitality, Leilani ensures every
                          guest feels the warmth of Hawaiian hospitality.
                        </p>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm transition hover:shadow-md">
                      <div className="h-3 bg-purple-500" aria-hidden="true" />
                      <div className="p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <h3 className="baloo-regular mb-1 text-center text-xl font-bold">
                          Chef Diya
                        </h3>
                        <p className="mb-4 text-center text-purple-600">
                          Sous Chef
                        </p>
                        <p className="text-center text-gray-700">
                          A culinary innovator who blends traditional techniques
                          with bold flavors to create unique dishes.
                        </p>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#78350F] p-8 text-center shadow-lg">
                  <h3 className="baloo-regular mb-4 text-2xl font-bold text-[#F5E1A4]">
                    Join Our Ohana!
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-[#FFFFF0]">
                    We're always looking for passionate individuals to join our
                    growing team.
                  </p>
                  <Link
                    to="/jobs"
                    aria-label="View open positions"
                    className="baloo-regular cursor-pointer rounded-2xl bg-white px-6 py-3 text-lg font-bold text-[#000000] shadow-[0_6px_0_rgb(186,183,201)] transition hover:translate-y-1 hover:scale-105 hover:shadow-[0_4px_0px_rgb(186,183,201)] focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
                  >
                    View Open Positions
                  </Link>
                </div>
              </section>
            )}

            {activeTab === 'values' && (
              <section
                id="panel-values"
                role="tabpanel"
                aria-labelledby="tab-values"
                className="w-full max-w-full overflow-x-hidden"
              >
                <div className="mb-12 grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
                  <div className="w-full min-w-0">
                    <h2 className="baloo-regular relative mb-4 inline-block pb-2 text-2xl font-bold sm:text-3xl">
                      What We Stand For
                      <span
                        className="absolute bottom-0 left-0 h-2 w-full rounded bg-purple-200"
                        aria-hidden="true"
                      />
                    </h2>
                    <p className="mb-4 text-gray-700">
                      At Kailani, our values are inspired by the Hawaiian
                      concept of "Pono" – doing what is right, in the right way,
                      at the right time, for the right reason.
                    </p>
                    <p className="mb-6 text-gray-700">
                      These principles guide every decision we make, from
                      sourcing ingredients to serving our customers.
                    </p>
                    <div className="mb-4 flex flex-wrap">
                      <span className="m-1 rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                        Aloha Spirit
                      </span>
                      <span className="m-1 rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
                        Authenticity
                      </span>
                      <span className="m-1 rounded-full bg-yellow-100 px-4 py-2 font-bold text-yellow-700">
                        Community
                      </span>
                      <span className="m-1 rounded-full bg-pink-100 px-4 py-2 font-bold text-pink-700">
                        Sustainability
                      </span>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-center">
                      <img
                        src={fullKailaniLogo}
                        alt="Kailani Logo"
                        className="h-64 w-64 rounded-full border-4 border-white object-cover shadow-xl transition-transform duration-300 hover:scale-105 md:h-80 md:w-80"
                      />
                    </div>
                  </div>
                </div>

                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="baloo-regular relative mb-8 inline-block pb-2 text-center text-2xl font-bold sm:text-3xl">
                    Our Core Values
                    <span
                      className="absolute bottom-0 left-0 h-2 w-full rounded bg-purple-200"
                      aria-hidden="true"
                    />
                  </h2>
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                    <article className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm transition hover:shadow-md">
                      <div
                        className="h-3 bg-gradient-to-r from-green-400 to-green-600"
                        aria-hidden="true"
                      />
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="baloo-regular text-xl font-bold">
                            Aloha Spirit
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          We treat everyone who walks through our doors as
                          family, sharing the warmth and hospitality that Hawaii
                          is known for.
                        </p>
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div
                              className="h-full w-full rounded-full bg-green-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm transition hover:shadow-md">
                      <div
                        className="h-3 bg-gradient-to-r from-blue-400 to-blue-600"
                        aria-hidden="true"
                      />
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="baloo-regular text-xl font-bold">
                            Authenticity
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          We stay true to traditional Hawaiian flavors and
                          techniques while also embracing innovation and
                          creative cooking.
                        </p>
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div
                              className="h-full w-[95%] rounded-full bg-blue-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-sm transition hover:shadow-md">
                      <div
                        className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-600"
                        aria-hidden="true"
                      />
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-yellow-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="baloo-regular text-xl font-bold">
                            Community
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          We actively engage with our local community through
                          partnerships, events, and giving back initiatives.
                        </p>
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div
                              className="h-full w-[90%] rounded-full bg-yellow-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm transition hover:shadow-md">
                      <div
                        className="h-3 bg-gradient-to-r from-pink-400 to-pink-600"
                        aria-hidden="true"
                      />
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-pink-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="baloo-regular text-xl font-bold">
                            Sustainability
                          </h3>
                        </div>
                        <p className="text-gray-700">
                          We prioritize environmentally conscious practices,
                          from sourcing local ingredients to minimizing waste.
                        </p>
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div
                              className="h-full w-[85%] rounded-full bg-pink-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#78350F] p-8 text-center shadow-lg">
                  <h3 className="baloo-regular mb-4 text-2xl font-bold text-[#F5E1A4]">
                    Experience Our Values in Action!
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-[#FFFFF0]">
                    Visit us to see how our values shape everything we do, from
                    our welcoming atmosphere to our delicious food.
                  </p>
                  <a
                    href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Find our location on maps in a new tab"
                    className="baloo-regular cursor-pointer rounded-2xl bg-white px-6 py-2 text-lg font-bold text-[#000000] shadow-[0_6px_0_rgb(186,183,201)] transition hover:translate-y-1 hover:scale-105 hover:shadow-[0_4px_0px_rgb(186,183,201)] focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
                  >
                    Find Us
                  </a>
                </div>
              </section>
            )}
          </section>
        </div>
      </main>
    </div>
  );
});

export default AboutPage;
