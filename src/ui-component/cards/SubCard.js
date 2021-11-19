import PropTypes from "prop-types";
import { forwardRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = forwardRef(
  (
    {
      children,
      content,
      contentClass,
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      onClick = () => {},
      actionSX = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        // sx={{
        //     border: '1px solid',
        //     borderColor: theme.palette.primary.light,
        //     ':hover': {
        //         boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
        //     },
        //     ...sx
        // }}
        sx={sx}
        {...others}
      >
        <CardActionArea onClick={onClick} sx={actionSX}>
          {!darkTitle && title && (
            <CardHeader
              sx={{ p: 2.5 }}
              title={
                <Typography variant="h5" color={theme.palette.text.base}>
                  {title}
                </Typography>
              }
              action={secondary}
            />
          )}
          {darkTitle && title && (
            <CardHeader
              sx={{ p: 2.5 }}
              title={
                <Typography variant="h4" color={theme.palette.text.base}>
                  {title}
                </Typography>
              }
              action={secondary}
            />
          )}

          {/* card content */}
          {content && (
            <CardContent
              sx={{ p: 2.5, ...contentSX }}
              className={contentClass || ""}
            >
              {children}
            </CardContent>
          )}
          {!content && children}
          {/* card header and action */}
        </CardActionArea>
      </Card>
    );
  }
);

SubCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  sx: PropTypes.object,
  contentSX: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
};

SubCard.defaultProps = {
  content: true,
};

export default SubCard;
