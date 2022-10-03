import React from 'react'
import styled from 'styled-components'

const Container = styled.div``

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1px;
`
const Title = styled.div``
const Value = styled.div``
const Content = styled.div``

type GroupProps = {
  title: string
  value?: string
}

export const Group: React.FC<GroupProps> = ({ title, value, children }) => {
  return (
    <Container>
      <Head>
        <Title>{title}</Title>
        {value && <Value>{value}</Value>}
      </Head>
      <Content>{children}</Content>
    </Container>
  )
}
