import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules'; // Import Pagination module
import 'swiper/css'; // Import Swiper CSS
import 'swiper/css/pagination'; // Import Pagination CSS

// Import custom CSS
import '../CSS/Swiper.css'; // Ensure this path is correct

export default function NewsSwiper({ data }) {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    setNewsData(data);
  }, [data]);

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }} 
      slidesPerView={1} 
      spaceBetween={5}
      loop={true}
      style={{ height: '400px', width: '300px' }}
    >
      {newsData.map((news, index) => (
        <SwiperSlide key={index}>
          <div className="swiper-box">
            <h3>{news.question}</h3>
            <p>{news.answer}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
