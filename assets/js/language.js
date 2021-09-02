(function(){ // Don't execute code at global scope

// Set default user language if none chosen yet.
var default_lang=$("#language-menu").attr("data-default");
if(!localStorage.getItem("language")){
	localStorage.setItem("language", default_lang);
}

var page_loading=false;

// When visiting the homepage redirect to user chosen language.
var current_lang=localStorage.getItem("language");
if(location.pathname == "/"){
	if(current_lang != default_lang){
		location.href="/" + current_lang + "/";
		page_loading = true;
	}
}

if(current_lang != default_lang){
	$("[data-localize]").localize(
		"",
		{
			language: current_lang,
			pathPrefix: "/assets/i18n"
		}
	);

	$("a[href^='/"+default_lang+"/']").each(function(i, e){
		var href=$(e).attr("href");
		if(href != "/"+default_lang+"/"){
			$(e).attr("href", href.replace("/"+default_lang+"/", "/"+current_lang+"/"));
		}
	});

	$("#logo-link").attr("href", "/" + current_lang + "/");
}

// Redirect not found pages to default language or root path
if(!localStorage.getItem("redirections")){
	localStorage.setItem("redirections", 0);
}
if($("#page-not-found").length > 0){
	var redirections=localStorage.getItem("redirections");
	if(redirections >= 3){
		localStorage.setItem("redirections", 0);
	} else{
		redirections++;
		localStorage.setItem("redirections", redirections);

		var path_parts=location.pathname.split("/");
		var path_extra = location.search + location.hash;

		// Redirect from /path to /user-lang-code/path
		if(path_parts[1] != default_lang && path_parts[1] != current_lang){
			location.href = "/" + current_lang + location.pathname + path_extra;
			page_loading = true;
		}
		// Redirects /user-lang-code/path to /default-lang-code/path
		// or /default-lang-code/path to /path
		else if(path_parts[1] != default_lang){
			if(path_parts[1] == current_lang){
				path_parts[1] = default_lang;
				location.href = path_parts.join("/") + path_extra;
			} else{
				location.href = "/" + default_lang + location.pathname + path_extra;
			}
			page_loading = true;
		// As last resort from /lang-code/path to /path
		} else{
			path_parts.splice(1, 1);
			location.href = path_parts.join("/") + path_extra;
			page_loading = true;
		}
	}
} else{
	localStorage.setItem("redirections", 0);
}

// Register user language of choice on language menu click.
$(document).ready(function(){
	if(!page_loading)
		$("body").css("visibility", "visible").hide().fadeIn("fast");

	$("#language-menu a").on("click", function(e){
		localStorage.setItem("language", $(this).attr("data-lang"));
		var path_parts = location.pathname.split("/");
		if(path_parts[1] == current_lang){
			path_parts[1] = $(this).attr("data-lang");
			location.href = path_parts.join("/") + location.search + location.hash;
		} else{
			location.reload();
		}
		e.preventDefault();
	});

	var language_image_parts=$("#language-image").attr("src").split("/");
	language_image_parts[language_image_parts.length-1] = current_lang + ".png";
	$("#language-image").attr("src", language_image_parts.join("/"));
});

})();
