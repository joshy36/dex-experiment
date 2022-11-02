import { Link, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <footer>
      <Stack direction="row" spacing={2}>
        <Link href={`https://github.com/joshy36`} target="_blank">
          <GitHubIcon fontSize="large" />
        </Link>
        <Link href={`https://linkedin.com/in/joshy36`} target="_blank">
          <LinkedInIcon fontSize="large" />
        </Link>
        <Link href={`https://twitter.com/JoshuaBender16`} target="_blank">
          <TwitterIcon fontSize="large" />
        </Link>
      </Stack>
    </footer>
  );
}
