import { Tabs } from "@mantine/core";
import { AuthorHeader } from "../../components/author/AuthorHeader";
import { ConversationTab } from "../../components/author/ConversationTab.tsx";
import { FollowingTab } from "../../components/author/FollowingTab.tsx";
import { IntroductionTab } from "../../components/author/IntroductionTab";
import { useParams } from "react-router-dom";
import { useState } from "react";
import type { AuthorPublicProfile } from "../../services/UserService.ts";

export function AuthorProfile() {
  const { authorId } = useParams<{ authorId: string }>();
  const [authorData, setAuthorData] = useState<AuthorPublicProfile | null>(null);

  return (
    <div className="min-h-screen">
      {authorId && (
        <AuthorHeader
          authorId={authorId}
          authorData={authorData}
          setAuthorData={setAuthorData}
        />
      )}

      <Tabs defaultValue="introduction" className="mt-8">
        <Tabs.List grow className="max-w-4xl mx-auto border-b bg-white">
          <Tabs.Tab value="introduction" className="py-4 text-lg font-medium">
            Giới thiệu
          </Tabs.Tab>
          <Tabs.Tab value="conversation" className="py-4 text-lg font-medium">
            Hội thoại
          </Tabs.Tab>
          <Tabs.Tab value="following" className="py-4 text-lg font-medium">
            Đang theo dõi
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="introduction" pt="xl">
          <IntroductionTab />
        </Tabs.Panel>

        <Tabs.Panel value="conversation" pt="xl">
          <ConversationTab />
        </Tabs.Panel>

        <Tabs.Panel value="following" pt="xl">
          {authorId && (
            <FollowingTab
              authorId={authorId}
              setAuthorData={setAuthorData} // <-- truyền callback
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
