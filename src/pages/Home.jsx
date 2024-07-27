import React, { useEffect } from "react";
import Header from "../components/profile/Header";
import useAuthStore from "../store/authStore";
import { doc } from "firebase/firestore";
import useGetCardList from "../hooks/useGetCardList";
import { db } from "../config/firebase";
import useGetDeckList from "../hooks/useGetDeckList";

export default function Home() {
  // const user = useAuthStore((state) => state.user);
  // const deckRef = doc(db, "users", user.uid, "library", deckId);

  // const { cardList, loading, averageDecayedMastery } = useGetCardList(deckRef);

  // console.log(cardList);

  const deckList = useGetDeckList();

  useEffect(() => {
    // sort by overall mastery
    deckList.sort((a, b) => a.overallMastery - b.overallMastery);
  }, [deckList]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Header />
      <div style={{ paddingTop: "90px" }}>
        <div className="container mx-4 md:mx-auto">
          <div className="text-xl font-semibold">Home</div>
          <div className="ml-32 mt-8 text-4xl font-semibold">
            Decks you need to revise
          </div>
          <div
            className="flex flex-row flex-wrap gap-4 ml-24 mt-8"
            style={{
              overflowY: "auto",
              flexGrow: 1,
              padding: "15px",
              height: "60vh",
              width: "100%",
            }}
          >
            {deckList && deckList.map((deck, index) => (
              <a key={index} href={`/library/owned/${deck.id}`}>
                <div
                  key={deck.id}
                  className="h-40 w-64 cursor-pointer rounded-3xl flex flex-col justify-center items-center text-xl relative overflow-hidden"
                  style={{ border: "1px solid " + deck.color }}
                >
                  <div
                    className="text-sm absolute top-0 left-0 p-2 rounded-2xl"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                  >
                    Mastery: {deck.overallMastery}%
                  </div>
                  {deck.deckName}
                  <div
                    className={`w-full h-full absolute left-0 top-0 -z-10 opacity-5`}
                    style={{
                      background: deck.color,
                    }}
                  ></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
