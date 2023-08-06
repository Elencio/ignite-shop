import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import Stripe from 'stripe'
import { CartContext } from '../../context/CartContext'
import { stripe } from '../../lib/stripe'
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product'
import { priceFormatter } from '../../utils/formatter'
import { useRouter } from 'next/router'

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const { addItemsToCart, orderAlreadyExist } = useContext(CartContext)
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  function handleAddItemToCart() {
    const addNewItemToCart = { ...product }
    addItemsToCart(addNewItemToCart)
  }

  const ifOrderAlreadyExists = orderAlreadyExist(product.id)

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} alt="" width={520} height={480} />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{priceFormatter.format(product.price)}</span>

          <p>{product.description}</p>

          <button onClick={handleAddItemToCart} disabled={ifOrderAlreadyExists}>
            {ifOrderAlreadyExists
              ? 'Produto já está no carrinho'
              : 'Colocar na sacola'}
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = String(params?.id)

  if (!productId) {
    return {
      notFound: true,
    }
  }

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        imageUrl: product.images[0],
        name: product.name,
        description: product.description,
        price: price.unit_amount / 100,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}
