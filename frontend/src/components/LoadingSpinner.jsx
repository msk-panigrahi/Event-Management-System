const LoadingSpinner = ({ size = 'md' }) => {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const dimension = sizeMap[size] || 48;

  return (
    <div className="loading-spinner">
      <div
        className="spinner"
        style={{ width: dimension, height: dimension }}
      />
    </div>
  );
};

export default LoadingSpinner;
