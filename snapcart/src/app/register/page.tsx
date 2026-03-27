'use client'
import RegisterForm from '@/src/components/RegisterForm'
import Welcome from '@/src/components/Welcome'
import React, { useState } from 'react'

function Register() {
  const [step, setStep] = useState(1)
  return (
    <div>
      {step === 1 ? <Welcome setStep={setStep}/> : <RegisterForm setStep={setStep}/>}
    </div>
  )
}

export default Register