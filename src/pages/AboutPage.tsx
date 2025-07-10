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
      {/* Hero Banner with teal background and SVG */}
      <div
        className="relative h-80 w-full overflow-hidden rounded-b-3xl shadow-md md:h-96"
        style={{ backgroundColor: '#19b4bd' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <img
                src={familyImage}
                alt="Kailani Family"
                className="h-48 w-72 rounded-2xl border-4 border-white/20 object-cover shadow-lg transition-transform duration-300 hover:scale-105 md:h-52 md:w-80"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
          <h1 className="baloo-regular mb-2 max-w-full text-3xl font-bold drop-shadow-lg sm:text-4xl md:text-6xl">
            Our Story
          </h1>
          <p className="baloo-regular max-w-xl px-4 text-lg font-light drop-shadow-md sm:text-xl md:text-2xl">
            The journey, passion, and people behind Kailani
          </p>
        </div>

        <div className="absolute right-5 bottom-5 rounded-full bg-white p-3 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-cyan-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full max-w-full overflow-x-hidden bg-[#f0c91f] px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 flex w-full justify-center">
            <div className="flex max-w-full flex-wrap justify-center space-x-1 rounded-xl bg-gray-100 p-2 sm:space-x-2">
              <button
                onClick={() => setActiveTab('story')}
                className={`baloo-regular min-w-0 cursor-pointer rounded-lg px-3 py-3 text-sm font-bold sm:px-6 sm:text-base ${
                  activeTab === 'story'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-[#000000] hover:bg-gray-200'
                }`}
              >
                Our Story
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`baloo-regular min-w-0 cursor-pointer rounded-lg px-3 py-3 text-sm font-bold sm:px-6 sm:text-base ${
                  activeTab === 'team'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-[#000000] hover:bg-gray-200'
                }`}
              >
                Our Team
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`baloo-regular min-w-0 cursor-pointer rounded-lg px-3 py-3 text-sm font-bold sm:px-6 sm:text-base ${
                  activeTab === 'values'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-[#000000] hover:bg-gray-200'
                }`}
              >
                Our Values
              </button>
            </div>
          </div>

          {/* Content sections */}
          <div className="mx-auto w-full max-w-4xl overflow-x-hidden pb-16">
            {/* Our Story Section */}
            {activeTab === 'story' && (
              <div className="w-full">
                <div className="mb-12 flex w-full flex-col items-center gap-8 md:flex-row">
                  <div className="w-full md:w-1/2">
                    <div className="flex justify-center">
                      <img
                        src={bigIslandYus}
                        alt="Big Island Yus"
                        className="h-64 w-64 rounded-full border-4 border-white object-cover shadow-xl transition-transform duration-300 hover:scale-105 md:h-80 md:w-80"
                      />
                    </div>
                  </div>
                  <div className="w-full min-w-0 md:w-1/2">
                    <h2 className="baloo-regular relative mb-4 inline-block pb-2 text-2xl font-bold text-[#002B5B] sm:text-3xl">
                      How It All Began
                      <span className="absolute bottom-0 left-0 h-2 w-full rounded bg-amber-100"></span>
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
                    <div className="rounded-xl border-l-4 border-cyan-500 bg-cyan-50 p-4">
                      <p className="text-gray-700 italic">
                        "Food is a universal language that brings people
                        together. At Kailani, we want to share the aloha spirit
                        through our dishes."
                      </p>
                      <p className="mt-2 font-bold text-gray-800">
                        — Chef Miriam, Founder
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="baloo-regular relative mb-8 inline-block pb-2 text-center text-2xl font-bold text-[#002B5B] sm:text-3xl">
                    Our Journey
                    <span className="absolute bottom-0 left-0 h-2 w-full rounded bg-amber-100"></span>
                  </h2>
                  <div className="relative w-full">
                    {/* Line */}
                    <div className="absolute left-1/2 z-0 h-full w-1 -translate-x-1/2 transform bg-amber-100"></div>

                    {/* Timeline items */}
                    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
                      {/* 2015 */}
                      <div className="relative md:col-start-2">
                        {/* Dot */}
                        <div className="absolute top-6 -left-[42px] z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-amber-500 md:block"></div>
                        <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6 shadow-md hover:shadow-lg">
                          <h3 className="baloo-regular mb-1 text-xl font-bold text-amber-600">
                            2015
                          </h3>
                          <h4 className="baloo-regular mb-2 text-lg font-bold text-gray-800">
                            First Pop-up
                          </h4>
                          <p className="text-[#333333">
                            Kailani started as a weekend pop-up at local
                            farmers' markets, serving Hawaiian-inspired street
                            food.
                          </p>
                        </div>
                      </div>

                      {/* Empty space for layout */}
                      <div className="hidden md:block"></div>

                      {/* 2017 */}
                      <div className="relative md:col-start-1 md:text-right">
                        {/* Dot */}
                        <div className="absolute top-6 -right-[42px] z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-cyan-500 md:block"></div>
                        <div className="rounded-xl border-r-4 border-cyan-500 bg-cyan-50 p-6 shadow-md hover:shadow-lg">
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
                        </div>
                      </div>

                      {/* 2020 */}
                      <div className="relative md:col-start-2">
                        {/* Dot */}
                        <div className="absolute top-6 -left-[42px] z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-purple-500 md:block"></div>
                        <div className="rounded-xl border-l-4 border-purple-500 bg-purple-50 p-6 shadow-md hover:shadow-lg">
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
                        </div>
                      </div>

                      {/* Empty space for layout */}
                      <div className="hidden md:block"></div>

                      {/* 2022 */}
                      <div className="relative md:col-start-1 md:text-right">
                        {/* Dot */}
                        <div className="absolute top-6 -right-[42px] z-10 hidden h-5 w-5 rounded-full border-4 border-amber-100 bg-green-500 md:block"></div>
                        <div className="rounded-xl border-r-4 border-green-500 bg-green-50 p-6 shadow-md hover:shadow-lg">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Join Us CTA */}
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
                    className="font-navigation baloo-regular cursor-pointer rounded-xl bg-white px-6 py-3 text-lg font-bold text-[#000000] shadow-[0_6px_0_rgb(186,183,201)] transition-all duration-200 hover:translate-y-1 hover:scale-105 hover:shadow-[0_4px_0px_rgb(186,183,201)] focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:outline-none active:scale-95"
                  >
                    Visit Us Today
                  </a>
                </div>
              </div>
            )}

            {/* Our Team Section */}
            {activeTab === 'team' && (
              <div className="w-full max-w-full overflow-x-hidden">
                <div className="mb-12 flex w-full flex-col items-center gap-8 md:flex-row">
                  <div className="w-full min-w-0 md:w-1/2">
                    <h2 className="baloo-regular relative mb-4 inline-block pb-2 text-2xl font-bold sm:text-3xl">
                      Meet Our Ohana
                      <span className="absolute bottom-0 left-0 h-2 w-full rounded bg-cyan-200"></span>
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
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-cyan-500"></div>
                      <p className="font-bold text-gray-800">5+ Team Members</p>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-amber-500"></div>
                      <p className="font-bold text-gray-800">
                        5+ Nationalities
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-purple-500"></div>
                      <p className="font-bold text-gray-800">
                        100% Passionate About Food
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <img
                      src={aboutTeam}
                      alt="Our Team"
                      className="mx-auto w-full max-w-sm"
                    />
                  </div>
                </div>

                {/* Team cards */}
                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="baloo-regular relative mb-8 inline-block pb-2 text-center text-2xl font-bold sm:text-3xl">
                    Key Team Members
                    <span className="absolute bottom-0 left-0 h-2 w-full rounded bg-cyan-200"></span>
                  </h2>
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Chef Kai */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-amber-500"></div>
                      <div className="p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                    </div>

                    {/* Leilani */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-cyan-500"></div>
                      <div className="p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-cyan-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                    </div>

                    {/* Chef Mike */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-purple-500"></div>
                      <div className="p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                    </div>
                  </div>
                </div>

                {/* Join Our Team CTA */}
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
                    className="font-navigation baloo-regular cursor-pointer rounded-xl bg-white px-6 py-3 text-lg font-bold text-[#000000] shadow-[0_6px_0_rgb(186,183,201)] transition-all duration-200 hover:translate-y-1 hover:scale-105 hover:shadow-[0_4px_0px_rgb(186,183,201)] focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:outline-none active:scale-95"
                  >
                    View Open Positions
                  </Link>
                </div>
              </div>
            )}

            {/* Our Values Section */}
            {activeTab === 'values' && (
              <div className="w-full max-w-full overflow-x-hidden">
                <div className="mb-12 flex w-full flex-col items-center gap-8 md:flex-row">
                  <div className="w-full min-w-0 md:w-1/2">
                    <h2 className="baloo-regular relative mb-4 inline-block pb-2 text-2xl font-bold sm:text-3xl">
                      What We Stand For
                      <span className="absolute bottom-0 left-0 h-2 w-full rounded bg-purple-200"></span>
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

                    {/* Value pills */}
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
                  <div className="w-full md:w-1/2">
                    <div className="flex justify-center">
                      <img
                        src={fullKailaniLogo}
                        alt="Kailani Logo"
                        className="h-64 w-64 rounded-full border-4 border-white object-cover shadow-xl transition-transform duration-300 hover:scale-105 md:h-80 md:w-80"
                      />
                    </div>
                  </div>
                </div>

                {/* Values details */}
                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="baloo-regular relative mb-8 inline-block pb-2 text-center text-2xl font-bold sm:text-3xl">
                    Our Core Values
                    <span className="absolute bottom-0 left-0 h-2 w-full rounded bg-purple-200"></span>
                  </h2>
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Aloha Spirit */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-gradient-to-r from-green-400 to-green-600"></div>
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div className="h-full w-full rounded-full bg-green-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Authenticity */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div className="h-full w-[95%] rounded-full bg-blue-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Community */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-yellow-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div className="h-full w-[90%] rounded-full bg-yellow-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sustainability */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl">
                      <div className="h-3 bg-gradient-to-r from-pink-400 to-pink-600"></div>
                      <div className="p-6">
                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-pink-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="h-4 rounded-full bg-gray-200">
                            <div className="h-full w-[85%] rounded-full bg-pink-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Us CTA */}
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
                    className="font-navigation baloo-regular cursor-pointer rounded-xl bg-white px-6 py-2 text-lg font-bold text-[#000000] shadow-[0_6px_0_rgb(186,183,201)] transition-all duration-200 hover:translate-y-1 hover:scale-105 hover:shadow-[0_4px_0px_rgb(186,183,201)] focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:outline-none active:scale-95"
                  >
                    Find Us
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AboutPage;
