import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLeft,faRankingStar ,faHeadset } from '@fortawesome/free-solid-svg-icons'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 test-xs sm:text-sm md:text-base text-gray-700 '>
        <div>
            <FontAwesomeIcon icon={faRightLeft} size='2xl' />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>We offer hasle free exchange policy</p>
        </div>
         <div>
           <FontAwesomeIcon icon={faRankingStar} size='2xl' />
            <p className='font-semibold'>7-Days Return Policy</p>
            <p className='text-gray-400'>We offer hasle free exchange policy</p>
        </div>
         <div>
            <FontAwesomeIcon icon={faHeadset} size='2xl' />
            <p className='font-semibold'>24/7 Support</p>
            <p className='text-gray-400'>We offer hasle free exchange policy</p>
        </div>
      
    </div>
  )
}

export default OurPolicy
