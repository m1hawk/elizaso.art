'use client'
import '@mantine/carousel/styles.css';
import {Image} from '@mantine/core';
import {Carousel} from "@mantine/carousel";

export function CusCarousel({list, onSlideChange}: any) {
  return <>
    <Carousel
            withIndicators={false}
            height={410}
            w={410}
            slideSize="410"
            slideGap="md"
            loop
            align="start"
            slidesToScroll={1}
            initialSlide={0}
            mx={'auto'}
            onSlideChange={onSlideChange}
    >
      {
        list.map((item: any, index: any) => (<Carousel.Slide key={index}>
          <Image src={item.imageUri} width={410} height={410}/>
        </Carousel.Slide>))
      }

    </Carousel>
  </>
}