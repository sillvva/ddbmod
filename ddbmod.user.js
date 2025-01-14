// ==UserScript==
// @name         D&D Beyond Moderator
// @namespace    http://dndbeyond.com/
// @version      3.0.7
// @description  Adds extra moderator options and links
// @downloadURL  https://github.com/sillvva/ddbmod/blob/main/ddbmod.user.js
// @updateURL  	 https://github.com/sillvva/ddbmod/raw/main/ddbmod.user.js
// @author       Sillvva
// @match        https://www.dndbeyond.com/*
// @grant        none
// ==/UserScript==

let itvl = {};

const runScript = function () {
	"use strict";

	// Campaign
	if (inPages("/campaigns")) {
		const inviteLink = document.querySelector(".ddb-campaigns-invite-primary");
		if (inviteLink) {
			const link = document.createElement("A");
			link.setAttribute("href", inviteLink.innerText);
			link.innerText = inviteLink.innerText;
			link.style.textDecoration = "underline";
			inviteLink.innerHTML = "";
			inviteLink.appendChild(link);
		}
	}

	// Reddit Spam
	if (inPages("/forums")) {
		// .forum-posts > header.h2 > h2
		const headerEl = document.querySelector(".forum-posts > header.h2");
		if (headerEl) {
			const titleEl = headerEl.querySelector("h2");
			if (titleEl) {
				const title = encodeURIComponent(titleEl.innerText);
				var targetURL = 'https://www.google.com/search?q=site%3Areddit.com+"' + title + '"';
				const userActions = headerEl.querySelector(".user-actions");
				if (userActions) {
					const action = document.createElement("LI");
					action.classList.add("user-action");
					action.classList.add("b-userAction-item");
					action.classList.add("user-action-reply");

					const actionLink = document.createElement("A");
					actionLink.setAttribute("href", targetURL);
					actionLink.setAttribute("target", "_blank");
					action.append(actionLink);

					const actionLabel = document.createElement("SPAN");
					actionLabel.classList.add("label");
					actionLabel.innerText = "REDDIT";
					actionLink.append(actionLabel);

					userActions.prepend(action);
				}
			}
		}
		// javascript: (() => {    var string = document.querySelector("#content > section > div > div.p-comments.p-comments-b.forum-posts > header > h2").textContent.trim();    var targetURL = "https://www.google.com/search?q=site%3Areddit.com+\"" + string +"\"";    window.open(targetURL);})();
	}

	// Homebrew Reject Reasons
	if (inPages("/cp/homebrew/reject")) {
		const rejectForm = document.querySelector("#rejection-form");
		const reason = document.querySelector("#field-homebrew-rejection");
		const notes = document.querySelector("#field-notes");

		let autoSave = localStorage.autosaveReject == 1 ? 1 : 0;

		function updateSaved() {
			if (reason.value == 1) {
				localStorage.savedCopyrightNotes = notes.value;
				copyBtn.innerText = `Copyright: ${localStorage.savedCopyrightNotes || ""}`;
			}
			if (reason.value == 17) {
				localStorage.saved3rdPNotes = notes.value;
				copyBtn2.innerText = `3rd Party: ${localStorage.saved3rdPNotes || ""}`;
			}
		}

		notes.addEventListener("input", updateSaved);
		notes.addEventListener("change", updateSaved);
		reason.addEventListener("change", updateSaved);

		let d1 = document.createElement("div");
		d1.style.marginTop = "1em";
		d1.style.marginBottom = "0.5em";
		let lbl1 = document.createElement("label");
		let autoSaveCheck = document.createElement("input");
		autoSaveCheck.checked = !!autoSave;
		autoSaveCheck.setAttribute("type", "checkbox");
		autoSaveCheck.onclick = function (ev) {
			localStorage.autosaveReject = autoSave = ev.target.checked ? 1 : 0;
		};
		lbl1.appendChild(autoSaveCheck);
		lbl1.append("Auto Save");
		d1.appendChild(lbl1);
		rejectForm.appendChild(d1);

		let nameBtn = document.createElement("button");
		nameBtn.innerText = "Bad Name";
		nameBtn.classList.add("button");
		nameBtn.onclick = function () {
			reason.value = 2;
			notes.value = `Do not publish homebrew content with titles that contain non-English words, begin with a symbol, number, or "A [something]", contain offensive or inappropriate language, or consists of gibberish or random characters. You are welcome to use this privately.`;
			return !!autoSave;
		};
		rejectForm.appendChild(nameBtn);

		let featBtn = document.createElement("button");
		featBtn.innerText = "Not a Feat";
		featBtn.classList.add("button");
		featBtn.onclick = function () {
			reason.value = 2;
			notes.value = `Do not submit feats that are not actually feats. If your items are meant to replicate blessings, curses, race features, class features, etc. You are welcome to use these privately, but they will not be allowed as published feats.`;
			return !!autoSave;
		};
		rejectForm.appendChild(featBtn);

		let notXBtn = document.createElement("button");
		notXBtn.innerText = "Not a X";
		notXBtn.classList.add("button");
		notXBtn.onclick = function () {
			reason.value = 2;
			notes.value = `Do not use a homebrew category to publish content that does not belong in that category. You are welcome to use these privately, but they will not be allowed as published homebrew.`;
			return !!autoSave;
		};
		rejectForm.appendChild(notXBtn);

    let inappBtn = document.createElement("button");
    inappBtn.innerText = "Inappropriate";
    inappBtn.classList.add("button");
    inappBtn.onclick = function () {
      reason.value = 2;
      notes.value = `Content must be appropriate for young audiences. You are welcome to use these privately, but they will not be allowed as published homebrew.`;
      return !!autoSave;
    };
    rejectForm.appendChild(inappBtn);


		let mistakeBtn = document.createElement("button");
		mistakeBtn.innerText = "Not Complete";
		mistakeBtn.classList.add("button");
		mistakeBtn.onclick = function () {
			reason.value = 2;
			notes.value = `You can use the "Create New Version" button to fix it after it has been published. You do not need to report your homebrew to make changes.`;
			return !!autoSave;
		};
		rejectForm.appendChild(mistakeBtn);

		let publishBtn = document.createElement("button");
		publishBtn.innerText = "Didn't Mean to Publish";
		publishBtn.classList.add("button");
		publishBtn.onclick = function () {
			reason.value = 2;
			notes.value = `The confirmation box that appears when you publish is meant to be read, not ignored.`;
			return !!autoSave;
		};
		rejectForm.appendChild(publishBtn);

		publishBtn = document.createElement("button");
		publishBtn.innerText = "Unearthed Arcana";
		publishBtn.classList.add("button");
		publishBtn.onclick = function () {
			reason.value = 12;
			return !!autoSave;
		};
		rejectForm.appendChild(publishBtn);

		let copyBtn = document.createElement("button");
		copyBtn.innerText = `Copyright: ${localStorage.savedCopyrightNotes || ""}`;
		copyBtn.classList.add("button");
		copyBtn.onclick = function () {
			try {
				reason.value = 1;
				if (localStorage.savedCopyrightNotes) {
					notes.value = localStorage.savedCopyrightNotes;
				}
				// if (autoSave) rejectForm.submit();
			} catch (err) {
				console.log(err);
			}
			return !!autoSave;
		};
		rejectForm.appendChild(copyBtn);

		let copyBtn2 = document.createElement("button");
		copyBtn2.innerText = `3rd Party: ${localStorage.saved3rdPNotes || ""}`;
		copyBtn2.classList.add("button");
		copyBtn2.onclick = function () {
			try {
				reason.value = 17;
				if (localStorage.saved3rdPNotes) {
					notes.value = localStorage.saved3rdPNotes;
				}
				// if (autoSave) rejectForm.submit();
			} catch (err) {
				console.log(err);
			}
			return !!autoSave;
		};
		rejectForm.appendChild(copyBtn2);
	}

	// Homebrew Reject Buttons
	if (inPages("/homebrew", "/magic-items", "/spells", "/monsters", "/feats", "/backgrounds", "/races", "/subraces", "/subclasses", "/equipment")) {
		// example full url for homebrew rejection
		// https://www.dndbeyond.com/cp/homebrew/reject?entityTypeId=112130694&id=11938
		// requires two parameters:
		// - entityTypeId
		// - id

		var pathArray; // Used any time we need to explode a path.
		if (window.location.pathname.startsWith("/homebrew/")) {
			var listRows = document.querySelectorAll(".list-row");
			for (let i = 0; i < listRows.length; i++) {
				listRows[i].onclick = function () {
					const slug = this.dataset.slug;
					const nodeName = `[data-slug="${slug}"] + .more-info`;
					itvl[nodeName] = setInterval(() => {
						addRejectButton(nodeName);
					}, 200);
					setTimeout(() => {
						if (itvl[nodeName]) {
							clearInterval(itvl[nodeName]);
							delete itvl[nodeName];
						}
					}, 5000);
				};
			}
		}
		// ADD AN "EDIT BUTTON" TO THE PAGE OF ALL MUNDANE EQUIPMENT.
		else if (window.location.pathname.startsWith("/equipment/")) {
			// Mundane equipment can be any of the following types, in terms of the edit URL (examples):
			//   /armor/half-plate/edit
			//   /weapons/longsword/edit
			//   /weapons/longsword/edit
			// To determine the correct edit URL, we examine the text in the TYPE field. If it is Armor, Weapon, or Other (adventuring-gear).
			// Get the txt from that part of the page. The div is named "details-container-content-description-text"
			var editUrl;
			var equipmentTypeField = document.getElementsByClassName("details-container-content-description-text")[0].children[0].innerText;
			if (equipmentTypeField.endsWith("Weapon")) {
				// This is a weapon
				editUrl = "https://www.dndbeyond.com/weapons/";
			} else if (equipmentTypeField.endsWith("Armor")) {
				// This is armor
				editUrl = "https://www.dndbeyond.com/armor/";
			} else {
				// This is adventuring-gear
				editUrl = "https://www.dndbeyond.com/adventuring-gear/";
			}
			var itemSlugPath = document.getElementsByClassName("b-breadcrumb-wrapper")[0].children[2].children[0].href;
			pathArray = itemSlugPath.split("/");
			editUrl = editUrl + pathArray[4] + "/edit";

			var SK_Breadcrumbs = document.getElementsByClassName("b-breadcrumb-wrapper")[0];

			// Create a new LI inside the header area
			var SK_editBreadcrumb = document.createElement("LI");
			SK_editBreadcrumb.className = "b-breadcrumb-item";
			SK_Breadcrumbs.appendChild(SK_editBreadcrumb);
			// Put a link inside that LI
			var SK_editLink = document.createElement("A");
			SK_editLink.setAttribute("href", editUrl);
			SK_editLink.innerHTML = '<span style="color:red">edit</span>';
			SK_editBreadcrumb.appendChild(SK_editLink);
		} else {
			addRejectButton("");
		}
	}

	// Moderate Users
	if (inPages("/cp/users")) {
		const cb = document.querySelector("input#field-add-nickname-credit:not([disabled])");
		if (cb) cb.setAttribute("checked", "checked");

		focusInput("input#field-nickname");

		const banType = document.querySelector("select#field-ban-type");
		banType.onchange = function () {
			if (this.value == 4) {
				setTimeout(() => {
					document.querySelectorAll("div#form-field-forum input").forEach((input) => {
						input.setAttribute("checked", "checked");
					});
				}, 250);
			}
		};
	}

	// Reports
	if (inPages("/cp/reports")) {
		document.querySelector("body").addEventListener("keyup", (e) => {
			if (e.key == "®") {
				// alt + r
				document.querySelector("#field-status-resolved").click();
			} else if (e.key == "∂") {
				// alt + d
				document.querySelector("#field-status-declined").click();
			}
		});

		const link = document.querySelector('.report-details header.h2 h2 a[target="_blank"]');
		const linkContainer = document.querySelector(".report-details header.h2 h2");

		if (link) {
			const hbLink = new URL(link.getAttribute("href"), "http://www.dndbeyond.com");
			const explodedLink = hbLink.pathname.split("/");
			const entityTypeId = {
				backgrounds: 1669830167,
				classes: 789467139,
				feats: 1088085227,
				"magic-items": 112130694,
				monsters: 779871897,
				races: 1743923279,
				species: 1743923279,
				spells: 1118725998,
				subclasses: 789467139,
				subraces: 1228963568,
			}[explodedLink[1]];
			const params = hbLink.searchParams;
			const pComment = params.get("comment");

			if (entityTypeId) {
				const id = explodedLink[2].split("-")[0];

				var rejectButtonLink = "https://www.dndbeyond.com/cp/homebrew/reject?entityTypeId=" + entityTypeId + "&id=" + id;

				var rejectButton = document.createElement("A");
				rejectButton.setAttribute("target", "_blank");
				rejectButton.setAttribute("href", rejectButtonLink);
				rejectButton.style =
					"background-color: red; color: white; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; width: 70px; height: 35px; margin-top: -6px; float: left; margin-right: 10px; text-decoration: none;";
				rejectButton.innerHTML = "Reject";
				linkContainer.prepend(rejectButton);
			}

      var comment = document.querySelector("#reported-content .j-comment[data-id]:not(.user-profile)");
			if (comment && (pComment || !entityTypeId)) {
				const commentId = comment.dataset.id;
				const deleteLink = `https://www.dndbeyond.com/comments/${commentId}/delete`;

				var deleteButton = document.createElement("A");
				deleteButton.setAttribute("target", "_blank");
				deleteButton.setAttribute("href", deleteLink);
				deleteButton.style =
					"background-color: red; color: white; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; width: 70px; height: 35px; margin-top: -6px; float: left; margin-right: 10px; text-decoration: none;";
				deleteButton.innerHTML = "Delete";
				deleteButton.classList.add("modal-link");
				deleteButton.dataset.title = "Delete Comment";
				deleteButton.dataset.deletePromptMessage = "Are you sure you want to Delete  this comment?";

				linkContainer.prepend(deleteButton);
			}
		}
	}

	// Bulk Moderation Box Styles
	if (inPages("/forums", "/posts", "/monsters", "/races")) {
		const cbm = document.querySelector(".comment-bulk-moderation");
		if (cbm) cbm.style.position = "sticky";
		if (cbm) cbm.style.width = "250px";
		if (cbm) cbm.style.marginLeft = "auto";
		if (cbm) cbm.style.right = "0";
		if (cbm) cbm.style.bottom = "0";
		if (cbm) cbm.style.borderWidth = "0";

		const jas = document.querySelector(".comment-bulk-moderation .j-apply-selection");
		if (jas) jas.style.color = "#ffffff";

		const cbms = document.querySelector(".comment-bulk-moderation select");
		if (cbms) cbms.style.margin = "0";
		if (cbms) cbms.style.width = "100%";

		const cbmf = document.querySelector(".comment-bulk-moderation form");
		if (cbmf) cbmf.style.margin = "0";
	}

	// New Content
	if (inPages("/new-content")) {
		addStyle(".select2-container {" + "    display: block;" + "    width: 600px !important;" + "}");
		setInterval(() => {
			const nodeList = document.querySelectorAll(".forum-thread-row a:not([target])");
			for (let i = 0; i < nodeList.length; i++) {
				nodeList[i].setAttribute("target", "_blank");
			}
		}, 500);
	}

	// Name Change Request
	if (inPages("/forums/d-d-beyond-general/bugs-support/65846-display-name-change-request-thread-v2")) {
		const posts = Array.from(document.querySelectorAll("li.p-comments"));
    window.unread = posts.filter(
			(post) =>
				!post.querySelectorAll(".comment-deleted").length &&
				!post.querySelectorAll(".comment-deleted-with-note").length &&
        !post.querySelectorAll(".public-message").length
		);

		if (unread[0]) {
			const id = unread[0].querySelector(".forum-post").id;
			setTimeout(() => {
				jump(id);
			}, 600);

			document.querySelector("body").addEventListener("keydown", (e) => {
        unread = posts.filter(
          (post) =>
            !post.querySelectorAll(".comment-deleted").length &&
            !post.querySelectorAll(".comment-deleted-with-note").length &&
            !post.querySelectorAll(".public-message").length
        );
				const hyper = e.ctrlKey && e.altKey && e.shiftKey && e.metaKey;
				if (hyper && e.code == "KeyM") {
					const link = unread[0].querySelector(".user-action-moderate");
					link.click();
				}
				if (hyper && e.code == "KeyN") {
					const post = unread[0].querySelector(".forum-post");
					// jump(post.id);
					post.querySelector(".add-note a").click();
					focusInput(".ui-widget .ui-dialog-content .form-field-text-field [type=text]");
				}
			});
		} else {
			const pageList = document.querySelector(".listing-container .b-pagination-list");
			const pages = pageList.querySelectorAll("li:not(.b-pagination-item-next, .b-pagination-item-prev, .dots)");
			const currentPage = [...pages].findIndex((page) => page.querySelector(".active"));
			const activePage = pages.item(currentPage);
			const lastPage = pages.item(pages.length - 1);
			const nextToLastPage = pages.item(pages.length - Math.min(2, pages.length - currentPage - 1));
			const nextExists = !!document.querySelector(".b-pagination-item-next");
			if (nextExists) {
        if (confirm("Jump to next page?")) {
          const nextPage = parseInt(activePage.innerText) + 1;
          location.href = location.href.replace(location.search, "?page=" + nextPage);
        } else if (confirm("No unread found. Jump to last page?")) {
					const lpNum = parseInt(lastPage.innerText);
					const ntlpNum = parseInt(nextToLastPage.innerText);
					let nextPage = ntlpNum;
					if (lpNum - ntlpNum > 1) nextPage = lpNum - 1;
					location.href = location.href.replace(location.search, "?page=" + nextPage);
				}
			} else {
				setTimeout(() => {
					window.scrollTo(0, document.body.scrollHeight - 1600);
				}, 1000);
			}
		}
	}

	// Forum Tweaks
	if (inPages("/forum")) {
		document.querySelectorAll(".forum-post.comment-user").forEach((post) => {
			const container = document.createElement("span");
			container.classList.add("p-comment-actions");
			container.style = "float: right;";

			const actions = document.createElement("span");
			actions.classList.add("user-actions");
			actions.style = "background: transparent !important;";
			container.appendChild(actions);

			const usernameLink = post.querySelector(".j-comment-username a");
			// const username = usernameLink.innerText;

			let user;
			if ((user = usernameLink.querySelector(".user"))) {
				user.style = "max-width: 85%";
			}

			const manageUserLink = document.createElement("a");
			manageUserLink.href = `/cp/users/${post.dataset.surrogateId}/edit#t1:moderate`;
			manageUserLink.target = "_blank";
			manageUserLink.innerHTML = '<i class="u-icon u-icon-edit"></i>';
			manageUserLink.style = "display: inline-flex;";
			manageUserLink.classList.add("user-action");
			manageUserLink.classList.add("user-action-moderate");
			manageUserLink.title = "Manage User";
			actions.appendChild(manageUserLink);

			insertAfter(usernameLink, container);
		});
	}

	// All Pages
	document.querySelectorAll(".magic-item-tooltip").forEach((mi) => {
		mi.after(" (magic item)");
	});

	addStyle(`
		.p-comments .p-comment-post:not(.mod-collection).comment-deleted .p-comment-wrapper, .p-comments .p-comment-post:not(.mod-collection).comment-mute-banned .p-comment-wrapper, .p-comments .p-comment-post:not(.mod-collection).comment-deleted-with-note .p-comment-wrapper {
			background: #888 url("../../blocks/images/ui/ui-deleted-bg.png") no-repeat center center!important;
		}
		.ui-dialog.create-warning-modal {
			z-index: 100004 !important;
		}
		.comment .forum-post-header .user-role-registered-users {
			/* color: white; */
		}
		.mce-container.mce-popover {
			z-index: 165535 !important;
		}
		.body-cp .j-comment blockquote {
			background-color: #e0e0e0e0;
			margin-bottom: 0.5rem !important;
		}
		blockquote blockquote blockquote blockquote {
			display: none;
		}
		.comment-reported blockquote {
			background: #8883 !important;
		}
		.report-listing .comment-deleted {
			background: #000c !important;
			color: white;
		}
		.warning-text {
			background: #0001;
			padding: 0.5rem !important;
		}
		.warning-text blockquote.source-quote {
			background: #0001;
			padding: 0.5rem !important;
		}
		.flash-messages {
			top: 0 !important;
		}
		.flash-messages .message {
			padding: 0.5em 5em !important;
		}
  `);
};

const parseURL = function (url) {
	let parser = document.createElement("a"),
		searchObject = {},
		queries,
		split;
	// Let the browser do the work
	parser.href = url;
	// Convert query string to object
	queries = parser.search.replace(/^\?/, "").split("&");
	if (parser.search.length > 0) {
		for (let i = 0; i < queries.length; i++) {
			split = queries[i].split("=");
			searchObject[split[0]] = split[1];
		}
	}
	return {
		protocol: parser.protocol,
		host: parser.host,
		hostname: parser.hostname,
		port: parser.port,
		pathname: parser.pathname,
		search: parser.search,
		searchObject: searchObject,
		hash: parser.hash,
	};
};

const inPages = function (...pages) {
	const url = parseURL(window.location.href);
	return pages.find((page) => url.pathname.indexOf(page) === 0);
};

const addStyle = function (newStyle) {
	let styleElement = document.getElementById("styles_js");
	if (!styleElement) {
		styleElement = document.createElement("style");
		styleElement.type = "text/css";
		styleElement.id = "styles_js";
		document.getElementsByTagName("head")[0].appendChild(styleElement);
	}
	styleElement.appendChild(document.createTextNode(newStyle));
};

const insertAfter = function (referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const jump = function (h) {
	location.href = "#" + h;
};

const focusInput = function (selector) {
	window.ktimer = setInterval(() => {
		const input = document.querySelector(selector);
		input.focus();
		input.select();
		if (input === document.activeElement) {
			clearInterval(window.ktimer);
		}
	}, 100);
};

function addRejectButton(nodeName) {
	if (nodeName) {
		const moreInfo = document.querySelector(nodeName);
		if (!moreInfo) return;
	}

	var reportButtonContainer = document.querySelector(`${nodeName} .report-button`);
	var rejectButtonExists = document.querySelector(`${nodeName} .reject-button`);

	if (reportButtonContainer && !rejectButtonExists) {
		if (nodeName.trim().length && itvl[nodeName]) {
			clearInterval(itvl[nodeName]);
			delete itvl[nodeName];
		}

		// and the parent footer container
		var FooterContainer = reportButtonContainer.parentNode;

		// Extract the data from the report button.
		// The elements of the explodedLink should be: 0:NULL / 3:reports / 4:create / 5:longID / 6:shortID
		var reportButtonLink = reportButtonContainer.children[0].href;
		var explodedLink = reportButtonLink.split("/");
		var rejectButtonLink = "https://www.dndbeyond.com/cp/homebrew/reject?entityTypeId=" + explodedLink[5] + "&id=" + explodedLink[6];

		// Create a new DIV container to put the new button in
		var rejectButtonDiv = document.createElement("DIV");
		rejectButtonDiv.setAttribute("class", "report-button");
		rejectButtonDiv.style = "margin-left:10px;";
		FooterContainer.insertBefore(rejectButtonDiv, reportButtonContainer.nextSibling);

		// Create the new "Reject" button
		var rejectButton = document.createElement("A");
		rejectButton.setAttribute("class", "reject-button");
		rejectButton.setAttribute("data-title", "Reject this homebrew");
		rejectButton.setAttribute("target", "_blank");
		rejectButton.setAttribute("data-modal-width", 500);
		rejectButton.setAttribute("href", rejectButtonLink);
		rejectButton.style = "background-color:red;";
		rejectButtonDiv.appendChild(rejectButton);

		// Add the div inside the link
		var rejectDiv = document.createElement("DIV");
		rejectDiv.setAttribute("class", "report-button-inner");
		rejectButton.appendChild(rejectDiv);

		// Add the I and span into the div
		var rejectDivI = document.createElement("I");
		rejectDivI.setAttribute("class", "fa-flag");
		rejectDiv.appendChild(rejectDivI);
		var rejectDivSpan = document.createElement("SPAN");
		rejectDivSpan.innerText = "Reject";
		rejectDiv.appendChild(rejectDivSpan);

		// New bit - gonna make the username into a hyperlink.

		//Get the user-id number from this: <div class="rating-up " data-user-id="101850578">
		var userIdTag = document.querySelector(`${nodeName} .rating-up`);
		var userID = userIdTag.getAttribute("data-user-id");
		// Extract the user-id from that tag.
		var userNameTag = document.querySelector(`${nodeName} .source-description`);
		var userName = userNameTag.innerText;
		var userProfileURL = "https://www.dndbeyond.com/members/" + userName;
		var userCPURL = "https://www.dndbeyond.com/cp/users/" + userID + "-" + userName + "/edit";

		// Now we want a link to view all homebrew from this user.
		var userHomebrewURL =
			"https://www.dndbeyond.com/cp/homebrew/approved?filter-author=" +
			userName +
			"&filter-author-previous=" +
			userName +
			"&filter-author-symbol=" +
			userID +
			"&filter-type=&filter-name=";
		// Change the contents of the userNameTag
		userNameTag.innerHTML =
			'<a href="' +
			userProfileURL +
			'" target="_blank">' +
			userName +
			"'s profile</a> [<a href=\"" +
			userCPURL +
			'" target="_blank">CP</a>]<br /><a href="' +
			userHomebrewURL +
			'" target="_blank">View user\'s other homebrew</a>';
		userNameTag.children[0].style.color = "#47D18C";
		userNameTag.children[1].style.color = "#F1474C";
		userNameTag.children[3].style.color = "#23b5e1";
		userNameTag.style.textAlign = "right";
	}
}

runScript();
