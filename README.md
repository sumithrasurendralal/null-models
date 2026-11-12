# Rock–paper–scissors: GitHub Pages + Google Sheets

Participants anonymously select rock, paper or scissors 30 times. A row per participant is written to a private Google Sheet, with 30 individual move columns, move counts and number of consecutive repetitions.

## Google Sheets setup

1. Create a **blank Google Sheet** called `Null models workshop responses`.
2. In the spreadsheet go to **Extensions → Apps Script**.
3. Delete the starter code and paste the complete contents of **Code.gs** from this package. Click **Save**.
4. In the function dropdown choose **setupSheet** and click **Run** once. Approve the Google authorization prompts. A tab called `Responses` appears in your spreadsheet.
5. Select **Deploy → New deployment → Select type: Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then click **Deploy**. Approve authorization if prompted.
6. Copy the resulting **Web app URL**, which begins `https://script.google.com/macros/s/` and ends `/exec`.
7. In your GitHub repository open **config.js**, click the pencil, replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL (keep the surrounding quotation marks), then **Commit changes**.
8. Verify the live GitHub Pages site. Complete a 30-move test sequence and check the `Responses` tab for a new row. Only invite workshop participants **after** verifying a real row was recorded.

## Updating the experiment

Open `index.html` in GitHub and click **Edit this file** (pencil) to change instructional text, labels or styles. Commit to publish. Edit `config.js` only to change the endpoint. You do not need `setup.sql` and may delete it from the old Supabase version. Upload **index.html**, **config.js**, and **Code.gs** at the root of the repository. Only index.html and config.js are served to participants; Code.gs is a convenient copy of the server script, not an active script until pasted into Apps Script.

## Important limits

- GitHub Pages does **not** collect responses. Google Apps Script collects them in the spreadsheet.
- Because the browser sends to Apps Script cross-origin, it cannot verify receipt. After pressing submit, users see “Sequence sent,” not “Saved.” Check the Google Sheet with a test submission before class and during the session.
- Deploying the Apps Script with `Anyone` means anyone who learns the endpoint can submit data. The Google Sheet itself remains private if you do not share it. Use only anonymous classroom data, and do not publish personal details.
- Every submitted row has a unique ID; repeated delivery of the same ID is ignored.
- `Workshop code` is for grouping responses, **not** a password.
- If you modify **Code.gs** after deployment, use **Deploy → Manage deployments → Edit → New version → Deploy** to update the live endpoint.
- Preserve participant boundaries when computing consecutive repetitions: never count the junction between two different participants' sequences.

## Experiment design

The activity does not show move frequencies during the 30 choices. After collection, compare observed repetitions with (a) equal-probability independent choices, (b) independent choices using empirically estimated move probabilities, and (c) permutations that preserve exact within-player move counts.
