import { useCallback, useEffect } from 'react'
import {
  Button,
  CodeBlock,
  IconAlertTriangle,
  IconCornerDownLeft,
  IconUser,
  Input,
  MessageRole,
  MessageStatus,
  UseAiChatOptions,
  useAiChat,
} from 'ui'

import { cn } from '../../../utils/cn'
import { AiWarning } from '../Command.alerts'
import { AiIconChat } from '../Command.icons'
import { useAutoInputFocus, useHistoryKeys } from '../Command.utils'
import { useCommandMenu } from '../CommandMenuProvider'
import { generatePrompt } from './GenerateFilters.utils'

const GenerateFilters = () => {
  const { isLoading, setIsLoading, search, setSearch, isOptedInToAI } = useCommandMenu()

  const messageTemplate = useCallback<NonNullable<UseAiChatOptions['messageTemplate']>>(
    (message) => generatePrompt(message),
    [isOptedInToAI]
  )

  const { submit, reset, messages, isResponding, hasError } = useAiChat({
    messageTemplate,
    setIsLoading,
  })

  const inputRef = useAutoInputFocus()

  useHistoryKeys({
    enable: !isResponding,
    messages: messages
      .filter(({ role }) => role === MessageRole.User)
      .map(({ content }) => content),
    setPrompt: setSearch,
  })

  const handleSubmit = useCallback(
    (message: string) => {
      setSearch('')
      submit(message)
    },
    [submit]
  )

  const handleReset = useCallback(() => {
    setSearch('')
    reset()
  }, [reset])

  useEffect(() => {
    if (search) handleSubmit(search)
  }, [])

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className={cn('relative py-4 max-h-[420px] overflow-auto', 'mb-[64px]')}>
        {messages.map((message, i) => {
          switch (message.role) {
            case MessageRole.User:
              return (
                <div className="flex gap-6 mx-4 [overflow-anchor:none] mb-6">
                  <div
                    className="
                      w-7 h-7 bg-scale-200 rounded-full border border-scale-400 flex items-center justify-center text-scale-1000 first-letter:
                      ring-scale-200 ring-1 shadow-sm
                    "
                  >
                    <IconUser strokeWidth={1.5} size={16} />
                  </div>
                  <div className="flex items-center prose text-scale-1100 text-sm">
                    {message.content}
                  </div>
                </div>
              )
            case MessageRole.Assistant:
              const answer = message.content

              const cantHelp =
                answer.replace(/^-- /, '') === "Sorry, I don't know how to help with that."

              return (
                <div className="px-4 [overflow-anchor:none] mb-6">
                  <div className="flex gap-6 [overflow-anchor:none] mb-6">
                    <div>
                      <AiIconChat />
                    </div>
                    <>
                      {message.status === MessageStatus.Pending ? (
                        <div className="bg-scale-700 h-[21px] w-[13px] mt-1 animate-bounce"></div>
                      ) : cantHelp ? (
                        <div className="p-6 flex flex-col flex-grow items-center gap-6 mt-4">
                          <IconAlertTriangle
                            className="text-amber-900"
                            strokeWidth={1.5}
                            size={21}
                          />
                          <p className="text-lg text-scale-1200 text-center">
                            Sorry, I don't know how to help with that.
                          </p>
                          <Button size="tiny" type="secondary" onClick={handleReset}>
                            Try again?
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 flex-grow max-w-[93%]">
                          <div className="-space-y-px">
                            <CodeBlock
                              hideCopy
                              language="sql"
                              className="
                                relative prose dark:prose-dark bg-scale-300 max-w-none !mb-0
                                !rounded-b-none
                                
                              "
                            >
                              {answer}
                            </CodeBlock>

                            <AiWarning className="!rounded-t-none border-scale-400" />
                          </div>
                        </div>
                      )}
                    </>
                  </div>
                </div>
              )
          }
        })}

        {messages.length === 0 && !hasError && (
          <div>
            <div className="px-4">
              <h3 className="text-base text-scale-1100">
                Describe the filters you want to apply to your table view
              </h3>
            </div>
          </div>
        )}

        {hasError && (
          <div className="p-6 flex flex-col items-center gap-6 mt-4">
            <IconAlertTriangle className="text-amber-900" strokeWidth={1.5} size={21} />
            <p className="text-lg text-scale-1200 text-center">
              Sorry, looks like Clippy is having a hard time!
            </p>
            <p className="text-sm text-scale-900 text-center">Please try again in a bit.</p>
            <Button size="tiny" type="secondary" onClick={handleReset}>
              Try again?
            </Button>
          </div>
        )}

        <div className="[overflow-anchor:auto] h-px w-full"></div>
      </div>

      <div className="absolute bottom-0 w-full bg-scale-200 pt-4">
        <Input
          inputRef={inputRef}
          className="bg-scale-100 rounded mx-3 mb-4"
          autoFocus
          placeholder={
            isLoading || isResponding
              ? 'Waiting on an answer...'
              : 'Describe how you want to filter your table view'
          }
          value={search}
          actions={
            <>
              {!isLoading && !isResponding ? (
                <div
                  className={`flex items-center gap-3 mr-3 transition-opacity duration-700 ${
                    search ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="text-scale-1100">Submit message</span>
                  <div className="hidden text-scale-1100 md:flex items-center justify-center h-6 w-6 rounded bg-scale-500">
                    <IconCornerDownLeft size={12} strokeWidth={1.5} />
                  </div>
                </div>
              ) : null}
            </>
          }
          onChange={(e) => {
            if (!isLoading || !isResponding) {
              setSearch(e.target.value)
            }
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Enter':
                if (!search || isLoading || isResponding) return
                return handleSubmit(search)
              default:
                return
            }
          }}
        />
      </div>
    </div>
  )
}

export default GenerateFilters
