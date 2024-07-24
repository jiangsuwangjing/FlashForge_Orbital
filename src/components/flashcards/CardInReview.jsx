import "react-quill/dist/quill.snow.css";

const CardInReview = ({ text, imageUrl, audioUrl }) => {
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
      <audio controls style={{ position: "absolute", top: "22%" }}>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>
      <div
        style={{
          height: "250px",
          minWidth: "250px",
          backgroundColor: "white",
          color: "black",
          padding: "10px",
          margin: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          userSelect: "none",
          position: "absolute",
          top: "28%",
          left: "41.4%",
        }}
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

export default CardInReview