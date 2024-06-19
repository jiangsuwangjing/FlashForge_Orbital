import React from 'react'
import { useEffect, useState } from 'react';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'

const CardFront = ({doc}) => {
  const front = doc.front;

  return (
    <>
      <div>
        {front}
      </div>
      <button>flip</button>
    </>
  )
}

export default CardFront