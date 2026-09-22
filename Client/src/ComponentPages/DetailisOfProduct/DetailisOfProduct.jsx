import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  addItemToCart,
  openCartPreview,
} from "../../store/slices/ShoppingCartSlice";

import {
  clearSelectedProduct,
  fetchProductById,
} from "../../store/slices/ProductSlice";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const getDisabledSizeSet = (sizes = []) => {
  return new Set(
    sizes
      .filter((item) => Number(item?.stock ?? 0) <= 0)
      .map((item) => item?.size)
      .filter(Boolean)
  );
};

export default function DetailisOfProduct() {
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products || {});

  const { token } = useSelector((state) => state.auth || {});

  const isLoggedIn = Boolean(token);

  const availableSizes = Array.isArray(product?.sizes)
    ? product.sizes
    : [];

  const sizeOptions = availableSizes
    .filter((item) => item?.size)
    .map((item) => ({
      size: item.size,
      stock: Number(item.stock ?? 0),
    }));

  const disabledSizeSet = getDisabledSizeSet(sizeOptions);

  // Normalize values such as brand and category.
  const getDisplayValue = (value) => {
    if (!value) return "לא צוין";

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      return value
        .map(getDisplayValue)
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.label ||
        "לא צוין"
      );
    }

    return String(value);
  };

  // Load the product.
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  // Add the product to the cart.
 // Add the product to the cart.
const handleAddToCart = async () => {
  if (!product) return;

  if (sizeOptions.length > 0 && !selectedSize) {
    setMessage("יש לבחור מידה לפני הוספת המוצר לסל");
    return;
  }

  if (!isLoggedIn) {
    setShowLoginModal(true);
    setMessage("");
    return;
  }

  try {
    await dispatch(
      addItemToCart({
        productId: product._id || product.id,
        quantity: 1,
        size: selectedSize,
      })
    ).unwrap();

    dispatch(openCartPreview());

    setMessage("המוצר נוסף לעגלה בהצלחה");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (err) {
    console.error("Add cart error:", err);

    setMessage("לא ניתן להוסיף את המוצר לעגלה");
  }
};

  // Loading state.
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <CircularProgress />

          <Typography>
            טוען מוצר...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Error state.
  if (error || !product) {
    return (
      <Alert
        severity="error"
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 5,
        }}
      >
        {error || "לא נמצא מוצר"}
      </Alert>
    );
  }

  return (
    <>
      {/* ================================= */}
      {/* Product page */}
      {/* ================================= */}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",

          px: {
            xs: 2,
            sm: 4,
            md: 8,
          },

          py: {
            xs: 3,
            md: 6,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 1250,
            mx: "auto",

            display: "grid",

            // Image on the right and details on the left.
            direction: "rtl",

            // Keep the image on the right on smaller screens as well.
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1.1fr 0.9fr",
              md: "1.1fr 0.9fr",
            },

            gap: {
              xs: 2,
              sm: 5,
              md: 10,
            },

            alignItems: "start",
          }}
        >
          {/* ================================= */}
          {/* Right side - product image */}
          {/* ================================= */}

          <Box
            sx={{
              width: "100%",

              display: "flex",

              justifyContent: "center",

              alignItems: "flex-start",
            }}
          >
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: "100%",

                maxWidth: 600,

                height: {
                  xs: 260,
                  sm: 420,
                  md: 650,
                },

                objectFit: "contain",

                display: "block",
              }}
            />
          </Box>

          {/* ================================= */}
          {/* Left side - product details */}
          {/* ================================= */}

          <Stack
            spacing={3}
            sx={{
              pt: {
                xs: 0,
                md: 3,
              },

              direction: "ltr",

              textAlign: "left",
            }}
          >
            {/* Back */}

            <Button
              onClick={() => navigate(-1)}
              sx={{
                alignSelf: "flex-start",

                padding: 0,

                minWidth: "auto",

                color: "#555",

                fontSize: "0.95rem",

                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#000",
                },
              }}
            >
              ← חזרה
            </Button>

            {/* Product name */}

            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  md: "2.6rem",
                },

                fontWeight: 500,

                color: "#111",

                lineHeight: 1.2,
              }}
            >
              {product.name}
            </Typography>

            {/* Price */}

            <Typography
              sx={{
                fontSize: "1.4rem",

                fontWeight: 600,

                color: "#111",
              }}
            >
              {product.price} ₪
            </Typography>

            {/* Divider */}

            <Box
              sx={{
                width: "100%",

                height: "1px",

                backgroundColor: "#e5e5e5",
              }}
            />

            {/* Product information */}

            <Stack spacing={1}>
              <Typography
                sx={{
                  fontSize: "0.95rem",

                  color: "#555",
                }}
              >
                <strong>מותג:</strong>{" "}
                {getDisplayValue(product.brand)}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.95rem",

                  color: "#555",
                }}
              >
                <strong>קטגוריה:</strong>{" "}
                {getDisplayValue(product.category)}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.95rem",

                  color: "#555",
                }}
              >
                <strong>צבע:</strong>{" "}
                {getDisplayValue(product.color)}
              </Typography>
            </Stack>

            {/* Description */}

            <Typography
              sx={{
                color: "#555",

                lineHeight: 1.8,

                fontSize: "1rem",
              }}
            >
              {product.description ||
                "מוצר איכותי ומעוצב במיוחד."}
            </Typography>

            {/* ================================= */}
            {/* Sizes */}
            {/* ================================= */}

            {sizeOptions.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    mb: 1.5,

                    fontWeight: 600,

                    fontSize: "1rem",
                  }}
                >
                  מידות
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    flexWrap: "wrap",
                  }}
                >
                  {sizeOptions.map((sizeOption) => {
                    const isDisabled = disabledSizeSet.has(sizeOption.size);

                    return (
                      <Button
                        key={sizeOption.size}
                        variant={
                          selectedSize === sizeOption.size
                            ? "contained"
                            : "outlined"
                        }
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedSize(sizeOption.size);
                          }
                        }}
                        sx={{
                          minWidth: 50,

                          height: 42,

                          borderRadius: 0,

                          borderColor:
                            selectedSize === sizeOption.size
                              ? "#000"
                              : "#cccccc",

                          backgroundColor:
                            selectedSize === sizeOption.size
                              ? "#000"
                              : "#fff",

                          color:
                            selectedSize === sizeOption.size
                              ? "#fff"
                              : "#222",

                          opacity: isDisabled ? 0.5 : 1,

                          cursor: isDisabled ? "not-allowed" : "pointer",

                          "&:hover": {
                            backgroundColor:
                              selectedSize === sizeOption.size
                                ? "#222"
                                : isDisabled
                                  ? "#fff"
                                  : "#f5f5f5",
                          },
                        }}
                      >
                        {sizeOption.size}
                      </Button>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* ================================= */}
            {/* Add to cart */}
            {/* ================================= */}

            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                width: "100%",

                mt: 2,

                py: 1.6,

                borderRadius: 0,

                backgroundColor: "#000",

                fontSize: "1rem",

                fontWeight: 600,

                "&:hover": {
                  backgroundColor: "#222",
                },
              }}
            >
              הוסף לסל
            </Button>

            {/* ================================= */}
            {/* Message */}
            {/* ================================= */}

            {message && (
              <Alert
                severity={
                  message.includes("בהצלחה")
                    ? "success"
                    : "error"
                }
              >
                {message}
              </Alert>
            )}
          </Stack>
        </Box>
      </Box>

      {/* ================================= */}
      {/* Login dialog */}
      {/* ================================= */}

      <Dialog
        open={showLoginModal}
        onClose={() =>
          setShowLoginModal(false)
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            textAlign: "center",

            fontWeight: 700,
          }}
        >
          עדיין לא התחברת
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              textAlign: "center",

              color: "#555",
            }}
          >
            כדי להוסיף מוצר לעגלה עליך להתחבר לחשבון.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",

            gap: 1,

            pb: 3,
          }}
        >
          <Button
            component={Link}
            to="/login"
            variant="contained"
            onClick={() =>
              setShowLoginModal(false)
            }
          >
            להתחברות
          </Button>

          <Button
            variant="outlined"
            onClick={() =>
              setShowLoginModal(false)
            }
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}