import React from 'react'
import { useContext } from 'react'

import { SectionStyled } from '../Layouts'
import GradientCard from './GradientCard'
import MainTitle from './MainTitle'
import styled from 'styled-components'
import CtaButton from './CtaButton'
import CollectionContext from '../store/collection-context'
function GradientCardsSection() {
  const collectionCtx = useContext(CollectionContext)
  return (
    <GradientCardsSectionStyled>
      <SectionStyled>
        <div className="title-con">
          <MainTitle
            title={'New Upcoming Items'}
            subtitle={'Discover Upcoming Items'}
            para={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo.'
            }
          />
        </div>
        <div className="gradient-cards-con">
          {collectionCtx.collection &&
            collectionCtx.collection.map((value, key) => {
              return (
                <>
                  <GradientCard
                    key={key}
                    image={value.img}
                    title={value.title}
                  />
                </>
              )
            })}
        </div>
        <div className="load">
          <CtaButton name={'View More'} />
        </div>
      </SectionStyled>
    </GradientCardsSectionStyled>
  )
}

const GradientCardsSectionStyled = styled.div`
  .load {
    padding-top: 3rem;
    text-align: center;
  }
`

export default GradientCardsSection
