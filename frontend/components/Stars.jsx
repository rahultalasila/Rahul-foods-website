function Stars({rating, reviews}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="dish-card-stars">
      <span className="stars">
        {"★".repeat(full)}{half?"½":""}{"☆".repeat(5-full-(half?1:0))}
      </span>
      <span className="stars-count">{rating} · {reviews} reviews</span>
    </div>
  );
}
