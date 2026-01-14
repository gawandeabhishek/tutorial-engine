"use client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { useTutorialStore } from "@/tutorial";
import { useChat } from "@ai-sdk/react";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { ToolUIPart, UIDataTypes, UIMessagePart, UITools } from "ai";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, regenerate } = useChat();
  const { tutorialId, start, stop, setId, step } = useTutorialStore();
  const [currentStep, setCurrentStep] = useState<number>(step);

  function isGetTutorialPart(
    part: UIMessagePart<UIDataTypes, UITools>
  ): part is ToolUIPart<{ getTutorial: any }> {
    return part.type === "tool-getTutorial";
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "assistant") return;

    const toolPart = lastMessage.parts.find(isGetTutorialPart);

    console.log(toolPart);
    if (toolPart?.state === "output-available" && toolPart.output?.tour) {
      setId(toolPart.output.tour.toString());
    }
  }, [messages, setId]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText) {
      return;
    }
    sendMessage({
      text: message.text,
    });
    setInput("");
  };

  const handleTutorialToggle = (status: boolean) => {
    if (status) {
      start(tutorialId!, currentStep);
      setTimeout(() => {
        document.getElementById("first")?.click();
      }, 50);
    } else {
      const id = tutorialId;
      stop();
      setId(id!);
      setCurrentStep(step);
    }
  };
  return (
    <div className="fixed bottom-4 right-4 w-90 h-120 z-50 shadow-lg rounded-xl overflow-hidden bg-white flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col p-2">
        <Conversation className="flex-1 overflow-auto">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <MessageActions>
                                <MessageAction
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </MessageAction>
                                <MessageAction
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </MessageAction>
                              </MessageActions>
                            )}
                        </Message>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          globalDrop
          multiple
        >
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter className="flex items-center justify-end">
            {tutorialId && <Switch onCheckedChange={handleTutorialToggle} />}
            <div className="hidden" id="first"></div>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
export default ChatBot;
