import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
const CardInReview = ({ text, handleFlip, imageUrl, audioUrl }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <audio controls style={{ position: "absolute", top: "17%" }}>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>
      <div
        style={{
          // height: "250px",
          // minWidth: "250px",
          // backgroundColor: "white",
          // padding: "10px",
          margin: "10px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "10px",
          backgroundColor: "#F5F5F5",
          // boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          // cursor: "pointer",
          // userSelect: "none",
          // position: "absolute",
          // top: "28%",
          // left: "41.4%",
        }}
        onClick={handleFlip}
        className="h-1/2 w-1/2 flex flex-col items-center justify-center text-black "
      >
        {text}
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Card visual"
          style={{ maxHeight: "200px", margin: "10px" }}
        />
      )}
    </div>
  );
};

export default CardInReview;
