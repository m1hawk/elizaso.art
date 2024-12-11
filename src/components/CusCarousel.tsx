'use client'
import '@mantine/carousel/styles.css';
import {Image} from '@mantine/core';
import {Carousel} from "@mantine/carousel";

export function CusCarousel() {
  const list = [
    'https://ai16z.s3.amazonaws.com/public/web/elizaos/image-1.png',
    'https://ai16z.s3.amazonaws.com/public/web/elizaos/image-2.png',
    'https://ai16z.s3.amazonaws.com/public/web/elizaos/image-3.png',
  ]
  return <>
    <Carousel
            withIndicators={false}
            height={410}
            w={410}
            slideSize="410"
            slideGap="md"
            loop
            align="start"
            slidesToScroll={3}
            mx={'auto'}
    >
      {
        list.map((item, index) => (<Carousel.Slide key={index}>
          <Image src={item} width={410} height={410}/>
        </Carousel.Slide>))
      }

    </Carousel>
  </>
}