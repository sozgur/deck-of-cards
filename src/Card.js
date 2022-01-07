const Card = ({ imgURL, value, suit, angle = 3, randomX = 3, randomY = 3 }) => {
    return (
        <div>
            <img
                src={imgURL}
                alt={`${value} of ${suit}`}
                style={{
                    transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`,
                }}
            />
        </div>
    );
};

export default Card;
