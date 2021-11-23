import React, { useState } from 'react'

import Layout from '~/components/Layouts/Default'
import CTABanner from 'components/CTABanner/index'
import { Button, Typography, IconDownload, Input } from '@supabase/ui'

import Link from 'next/link'

import SectionContainer from '~/components/Layouts/SectionContainer'

const { Title, Text } = Typography

const DPA = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setError('')
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/internal/downloads?email=${email}&document=dpa`,
        { method: 'POST' }
      )
      if (!response.ok) throw response
      window.open('https://supabase.com/downloads/docs/legal/dpa.pdf', '_blank')
      setMessage('A new tab should have opened with the DPA document')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <>
      <Layout>
        <SectionContainer className="pb-0 md:pb-0 lg:pb-0 text-center">
          <Title>DPA</Title>
        </SectionContainer>
        <SectionContainer>
          <div className="grid grid-cols-12 rounded-lg shadow-sm border dark:border-gray-600 max-w-2xl mx-auto">
            <div className="col-span-12 lg:col-span-12 flex items-center">
              <div className="p-16 flex flex-col space-y-8">
                <Text>
                  <p>
                    We have a long standing commitment to customer privacy and data protection, and
                    as part of that commitment we have prepared a pre-signed Data Processing
                    Addendum ("DPA").
                  </p>
                  <p>
                    The DPA has been drafted in order to ensure that Customer and Supabase (acting
                    as a service provider and/or processor) may meet their respective data
                    protection responsibilities and obligations under applicable data protection
                    laws.
                  </p>
                  <p>
                    The DPA applies in circumstances where the personal information that we process
                    on behalf of our Customers is subject to the General Data Protection Regulation
                    (GDPR), the UK General Data Protection Regulation (UK GDPR) and/or the
                    California Consumer Privacy Act ("CCPA").
                  </p>
                </Text>

                <Text type="secondary">
                  <p>Data Processing Addendum last updated 23rd November 2021</p>
                </Text>

                <Text>
                  <p>
                    You can download the latest DPA document by filling in your email below. We will
                    only use this email to notify you of when it is updated. This email will never
                    be used for marketing purposes. For more information on how we treat personal
                    information, please refer to our{' '}
                    <Link href="/docs/company/privacy">
                      <a className="underline cursor-pointer">Privacy Policy</a>
                    </Link>
                    .
                  </p>
                </Text>

                {message ? (
                  <Text type="success">{message}</Text>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      descriptionText="We only keep a record of your email so we can update you when the document has been updated."
                      placeholder="Your email address"
                      error={error}
                      actions={
                        <Button htmlType="submit" type="default" iconRight={<IconDownload />}>
                          Download DPA document
                        </Button>
                      }
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
        <CTABanner />
      </Layout>
    </>
  )
}

export default DPA
