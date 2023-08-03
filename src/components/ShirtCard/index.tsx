import Image from 'next/image'
import Link from 'next/link'
import { Handbag } from 'phosphor-react'
import { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { message } from 'antd'
import { priceFormatter } from '../../utils/formatter'
import { ProductContainer } from './styles'

export interface ShirtCardProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
    defaultPriceId: string
  }
}

export function ShirtCard({ product }: ShirtCardProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const { addItemsToCart, orderAlreadyExist } = useContext(CartContext)

  function handleAddItemsToCart() {
    const ifOrderAlreadyExists = orderAlreadyExist(product.id)

    if (!ifOrderAlreadyExists) {
      const addNewItemToCart = { ...product }
      addItemsToCart(addNewItemToCart)

      messageApi.open({
        type: 'success',
        content: (
          <span
            style={{
              fontSize: '18px',
              color: '#111111',
              borderRadius: '4px',
              padding: '8px 16px',
            }}
          >
            Adicionaste um item no carrinho
          </span>
        ),
      })
    }
  }

  const ifOrderExists = orderAlreadyExist(product.id)

  return (
    <>
      {contextHolder}
      <ProductContainer key={product.id}>
        <Link href={`/product/${product.id}`}>
          <Image src={product.imageUrl} alt="" width={520} height={480} />
        </Link>
        <footer>
          <div>
            <strong>{product.name}</strong>
            <p>{priceFormatter.format(product.price)}</p>
          </div>

          <button onClick={handleAddItemsToCart} disabled={ifOrderExists}>
            <Handbag size={32} weight="bold" />
          </button>
        </footer>
      </ProductContainer>
    </>
  )
}
