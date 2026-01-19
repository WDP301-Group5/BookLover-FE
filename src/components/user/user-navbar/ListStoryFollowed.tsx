import React from "react";
import { authorProfileMock } from "../../author/authorProfile";
import StoryItemCard from "../../story/StoryItemCard";

const ListStoryFollowed = () => {
  const stories = authorProfileMock.stories;

  return (
    <div className="flex flex-col gap-3 text-[#228be6] mb-3">
      <h1 className="text-[22px] font-semibold mb-2">
        Truyện đang theo dõi
      </h1>

      
      {stories.map((story) => (
        <StoryItemCard 
          key={story.id}
          story={story}
          type="top" 
        />
      ))}
    </div>
  );
};


export default ListStoryFollowed;
