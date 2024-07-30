import { useEffect, useState } from "react";
import "../../styles/App.css";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import ReactQuill from "react-quill";
import EditCardPreview from "./EditCardPreview";
import { arrayRemove } from "firebase/firestore";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import truncate from "html-truncate";
import { color } from "@chakra-ui/react";

/**
 * Cards displayed in the decks
 * @param card  the card document
 * @param deckRef the reference to parent deck
 * @param isFlipped the state of which side is showing
 * @param onFlip changes the side of card 
 * @returns a window
 */
const FlipCard = ({ card, deckRef, isFlipped, onFlip }) => {
  const cardId = card[2];
  const cardRef = doc(deckRef, "cards", cardId);
  const [front, setFront] = useState(card[0]);
  const [back, setBack] = useState(card[1]);
  const [frontImage, setFrontImage] = useState(card[3]);
  const [backImage, setBackImage] = useState(card[4]);
  const [frontAudioUrl, setFrontAudioUrl] = useState(card[5]);
  const [backAudioUrl, setBackAudioUrl] = useState(card[6]);
  const [mastery, setMastery] = useState(card[7]);
  const [popUp, setPopUp] = useState(false);
  const [expand, setExpand] = useState(false);
  const [content, setContent] = useState(front);
  const [colour, setColour] = useState("#884EA0")
  const [truncatedContent, setTruncatedContent] = useState("")
  const [response, setResponse] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const masteryColours = ["#880808", "#EC7063", "#F7DC6F", "#85C1E9", "#58D68D"]
  

  useEffect(() => {
    setFront(card[0]);
    setBack(card[1]);
    setFrontImage(card[3]);
    setBackImage(card[4]);
    setFrontAudioUrl(card[5]);
    setBackAudioUrl(card[6]);
    setMastery(Math.ceil(card[7]));
    const colourIndex = Math.floor(mastery / 20);
    setColour(masteryColours[colourIndex]);
  }, [card, deckRef])

  useEffect(() => {
    const truncContent = truncate(front, 240, { ellipsis: "..." });
    setTruncatedContent(truncContent);
  }, [card, front]);

  const handleContextMenu = (event) => {
    console.log("right click");
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  const handleClosePopup = () => {
    setPopUp(false);
  };
  const handleExpand = () => {
    setExpand(true);
  };
  const handleClose = () => {
    setExpand(false);
    if (isFlipped == true) {
      onFlip();
    }
  };

  const rephraseOption = async (event) => {
    event.stopPropagation();
    handleClick();
    const input = card[0];
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = import.meta.env.VITE_CHATGPT_API_KEY;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Rephrase this sentence: ${input}` },
        ],
      };

      const { data } = await axios.post(apiUrl, requestBody, { headers });

      const response = data.choices[0].message.content;
      console.log(response);
      setFront(response);
      
      try {
        let frontImageUrl = "";
        let backImageUrl = "";

        console.log("clicked");

        // Update the existing card document
        // let updateRes = 
        await updateDoc(cardRef, {
          front: response,
          back: back,
          ...(frontImageUrl && { frontImageUrl }), // Conditionally include frontImageUrl
          ...(backImageUrl && { backImageUrl }), // Conditionally include backImageUrl
          ...(frontAudioUrl && { frontAudioUrl }),
          ...(backAudioUrl && { backAudioUrl }),
          lastReviewed: Date.now(),
          mastery: 0,
        });

        // console.log(updateRes);

        console.log("Rephrased card updated successfully"); // Close the edit form
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const editOption = (event) => {
    event.stopPropagation();
    console.log("edit");
    setPopUp(true);
  };

  const deleteOption = async () => {
    try {
      let deleteHookRes = await deleteDoc(cardRef);
      let updateHookRes = await updateDoc(deckRef, {
        cardIds: arrayRemove(cardId),
      });

      console.log(deleteHookRes, updateHookRes);

      console.log(`Card with ID ${cardId} deleted successfully`);
    } catch (error) {
      console.error("Delete error" + error.message);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleClick);
    };
  }, [contextMenu]);

  useEffect(() => {
    setContent(isFlipped ? back : front);
  }, [isFlipped]);
  // const content = card[isFlipped ? 1 : 0];
  return (
    <>
      {expand && (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            zIndex: "1",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              flexDirection: "column",
            }}
          >
            {/* <audio controls style={{ position: "absolute", top: "10%" }}>
              <source
                src={!isFlipped ? frontAudioUrl : backAudioUrl}
                type="audio/mpeg"
              />
            </audio> */}
            { !isFlipped 
                ? frontAudioUrl && (
                  <audio controls style={{ position: "absolute", bottom: "30%" }}>
                    <source
                      src={frontAudioUrl}
                      type="audio/mpeg"
                    />
                  </audio>
                )
                : backAudioUrl && (
                  <audio controls style={{ position: "absolute", bottom: "30%" }}>
                    <source
                      src={backAudioUrl}
                      type="audio/mpeg"
                    />
                  </audio>
                )
              }
            <div
              style={{
                backgroundColor: "#F5F5F5 ",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                color: "black",
                margin: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                userSelect: "none",
                overflow: "hidden",
              }}
              className="w-1/2 h-1/2"
            >
              <div className="w-full h-5 mt-0 text-sm pl-2 font-semibold" style={{backgroundColor: colour}}>
                Mastery: {mastery}
              </div>
              <div className="w-full h-full flex flex-row justify-between items-stretch">
                <ReactQuill
                  // className="w-full h-full text-center"
                  theme="bubble"
                  value={content}
                  readOnly={true}
                  modules={{ toolbar: false }}
                />
                {!isFlipped
                  ? frontImage && (
                      <img
                        src={frontImage}
                        alt="front"
                        style={{ margin: "10px" }}
                      />
                    )
                  : backImage && (
                      <img
                        src={backImage}
                        alt="back"
                        style={{ margin: "10px" }}
                      />
                    )}
              </div>
              
              <audio
                controls
                style={{
                  bottom: "17%",
                  backgroundColor: "black",
                }}
              >
                <source
                  src={!isFlipped ? frontAudioUrl : backAudioUrl}
                  type="audio/mpeg"
                />
              </audio>
            </div>
            <div className="w-1/2 flex justify-evenly py-4">
              <button className="w-1/4 border-white" onClick={handleClose}>
                Close
              </button>
              <button className="w-1/4 border-white" onClick={onFlip}>
                Flip
              </button>
            </div>
          </div>
        </div>
      )}
      {popUp && (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            zIndex: "1",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <EditCardPreview
              card={card}
              cardRef={cardRef}
              onClose={handleClosePopup}
            />
          </div>
        </div>
      )}
      <div
        onContextMenu={handleContextMenu}
        // onClick={handleExpand}
        style={{
          height: "250px",
          width: "200px",
          backgroundColor: "#F5F5F5",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "black",
          margin: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          userSelect: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <div
          className="bg-sky-500 w-full h-5 mt-0 text-sm pl-2 font-semibold"
          style={{ backgroundColor: colour }}
        >
          Mastery: {mastery}
        </div>
        <div onClick={handleExpand} className="w-full h-full text-center">
          {
            <ReactQuill
              value={truncatedContent}
              readOnly={true}
              theme="bubble"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            />
          }
        </div>
        {contextMenu.visible && (
          <div
            style={{
              position: "absolute",
              width: "200px",
              backgroundColor: "#383838",
              borderRadius: "10px",
              boxSizing: "border-box",
              top: contextMenu.y,
              left: contextMenu.x - 70,
            }}
            zindex={10}
          >
            <ul
              style={{
                listStyle: "none",
                padding: "10px",
                margin: "0",
                boxSizing: "border-box",
              }}
            >
              <li style={styles.li} onClick={(e) => rephraseOption(e)}>
                Rephrase with AI
              </li>
              <li onClick={(e) => editOption(e)} style={styles.li}>
                Edit
              </li>
              <li onClick={deleteOption} style={styles.li}>
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
const styles = {
  li: {
    position: "sticky",
    fontSize: "14px",
    color: "white",
    padding: "12px 8px",
    ":hover": {
      backgroundColor: "black", // Example hover effect
      cursor: "pointer",
    },
  },
};

export default FlipCard;
