import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Stripe from 'stripe'
import { GetStaticProps } from 'next'
import { useKeenSlider } from 'keen-slider/react'
import { useState } from 'react'
import { stripe } from '../lib/stripe'
import { ShirtCard } from '../components/ShirtCard'
import { ArrowCircleLeft, ArrowCircleRight } from 'phosphor-react'
import { HomeContainer, Carouselcontainer } from '../styles/pages/home'
import Head from 'next/head'
import Slider from 'react-slick'

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
    defaultPriceId: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const settings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    speed: 500,
    centerPadding: 100,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  return (
    <>
      <Head>
        <title>Home | Ignite Shop 2.0</title>
      </Head>
      <HomeContainer>
        <Carouselcontainer>
          <Slider {...settings}>
            {products.map((product) => {
              return <ShirtCard key={product.id} product={product} />
            })}
          </Slider>
        </Carouselcontainer>
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((item) => {
    const price = item.default_price as Stripe.Price

    return {
      id: item.id,
      name: item.name,
      imageUrl: item.images[0],
      price: price.unit_amount / 100,
      defaultPriceId: price.id,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hour
  }
}

function SampleNextArrow(props) {
  const { style, onClick } = props
  return (
    <ArrowCircleRight
      color="#ffffff"
      style={{
        ...style,
        position: 'absolute',
        top: '50%',
        right: '10px',
        zIndex: 1,
        transform: 'translateY(-50%)',
        cursor: 'pointer',
      }}
      size={52}
      onClick={onClick}
    />
  )
}

function SamplePrevArrow(props) {
  const { style, onClick } = props
  return (
    <ArrowCircleLeft
      color="#ffffff"
      style={{
        ...style,
        position: 'absolute',
        top: '50%',
        left: '20px',
        zIndex: 1,
        transform: 'translateY(-50%)',
        cursor: 'pointer',
      }}
      size={52}
      onClick={onClick}
    />
  )
}
