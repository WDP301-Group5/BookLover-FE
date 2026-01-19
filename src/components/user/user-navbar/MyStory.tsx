import React from "react";
import { authorProfileMock } from "../../author/authorProfile";
import StoryCard from "../../story/StoryCard";


const MyStory = () => {
  const stories = authorProfileMock.stories;

  return (
    <div className="flex flex-col gap-3 text-[#228be6] mb-3">
      <h1 className="text-lg font-semibold mb-2 text-[22px]">Truyện của tôi</h1>

      {stories.map((story) => (
        <StoryCard key={story.id} story={story} type="top" />
      ))}
    </div>
  );
};

export default MyStory;
