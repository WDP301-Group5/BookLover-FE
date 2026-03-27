import { Box, Tabs, useMantineColorScheme } from "@mantine/core";
import { AuthorHeader } from "../../components/author/AuthorHeader";
import { ReadingListTab } from "../../components/author/ReadingListTab.tsx";
import { FollowingTab } from "../../components/author/FollowingTab.tsx";
import { IntroductionTab } from "../../components/author/IntroductionTab";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuthorPublicProfile } from "../../services/UserService.ts";
import Followers from "../../components/user/user-navbar/Followers.tsx";

export function AuthorProfile() {
  const { authorId } = useParams<{ authorId: string }>();
  const [authorData, setAuthorData] = useState<AuthorPublicProfile | null>(
    null,
  );
  const [refreshRelationsKey, setRefreshRelationsKey] = useState(0);
  const { colorScheme } = useMantineColorScheme();

  const isDark = colorScheme === "dark";

  useEffect(() => {
    const shouldScrollIntroTop =
      sessionStorage.getItem("author-profile-scroll-intro-top") === "1";

    if (!shouldScrollIntroTop) return;

    // Ensure layout is painted before scrolling.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      sessionStorage.removeItem("author-profile-scroll-intro-top");
    });
  }, []);

  const refreshAllRelations = () => {
    setRefreshRelationsKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {authorId && (
        <AuthorHeader
          authorId={authorId}
          authorData={authorData}
          setAuthorData={setAuthorData}
          refreshKey={refreshRelationsKey}
          onRelationsChanged={refreshAllRelations}
        />
      )}

      <Tabs
        defaultValue="introduction"
        variant="outline"
        className="mt-8"
        styles={{
          tab: {
            fontWeight: 600,
            fontSize: "clamp(14px, 2vw, 18px)",
            color: isDark ? "#C1C2C5" : "#495057",
            backgroundColor: "transparent",
          },
          tabLabel: {
            color: "inherit",
            whiteSpace: "nowrap",
          },
          panel: {
            width: "100%",
          },
        }}
      >
        <Box className="max-w-4xl mx-auto px-4">
          <Tabs.List
            grow
            className={`rounded-t-xl border-b ${
              isDark
                ? "border-white/10 bg-[#1A1B1E]"
                : "border-black/10 bg-white"
            }`}
          >
            <Tabs.Tab value="introduction" className="min-h-[52px]">
              Giới thiệu
            </Tabs.Tab>
            <Tabs.Tab value="conversation" className="min-h-[52px]">
              Danh sách đọc
            </Tabs.Tab>
            <Tabs.Tab value="following" className="min-h-[52px]">
              Đang theo dõi
            </Tabs.Tab>
            <Tabs.Tab value="followers" className="min-h-[52px]">
              Người theo dõi
            </Tabs.Tab>
          </Tabs.List>
        </Box>

        <Tabs.Panel value="introduction" pt="xl">
          <IntroductionTab />
        </Tabs.Panel>

        <Tabs.Panel value="conversation" pt="xl">
          <ReadingListTab />
        </Tabs.Panel>

        <Tabs.Panel value="following" pt="xl">
          {authorId && (
            <FollowingTab
              authorId={authorId}
              layout="profile"
              showTitle
              refreshKey={refreshRelationsKey}
              onFollowChanged={refreshAllRelations}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="followers" pt="xl">
          {authorId && (
            <Followers
              authorId={authorId}
              layout="profile"
              showTitle
              refreshKey={refreshRelationsKey}
              onFollowChanged={refreshAllRelations}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
