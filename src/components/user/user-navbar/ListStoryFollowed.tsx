import React from "react";
import { authorProfileMock } from "../../author/authorProfile";
import StoryCard from "../../story/StoryCard";

const ListStoryFollowed = () => {
  const stories = authorProfileMock.stories;

  return (
    <div className="flex flex-col gap-3 text-[#228be6] mb-3">
      <h1 className="text-[22px] font-semibold mb-2">
        Truyện đang theo dõi
      </h1>
      <div className="grid grid-cols-4 gap-4"> 
        {stories.map((story) => (
        <StoryCard key={story.id} story={story} type="home" />
      ))}
      </div>
    </div>
  );
};


export default ListStoryFollowed;
