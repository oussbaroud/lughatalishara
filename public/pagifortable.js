function pagina(){
  if(tableHtml != ""){
    function getPageList(totalPages, page, maxLength){
      function range(start, end){
        return Array.from(Array(end - start + 1), (_, i) => i + start);
      }
    
      var sideWidth = maxLength < 9 ? 1 : 2;
      var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
      var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    
      if(totalPages <= maxLength){
        return range(1, totalPages);
      }
    
      if(page <= maxLength - sideWidth - 1 - rightWidth){
        return range(1, maxLength - sideWidth - 1).concat(maxLength - sideWidth + 1 - rightWidth, range(totalPages - sideWidth + 1, totalPages));
      }
    
      if(page >= totalPages - sideWidth - 1 - rightWidth){
        return range(1, sideWidth).concat(totalPages - sideWidth - 3 - rightWidth, range(totalPages- sideWidth - 1 - rightWidth - leftWidth, totalPages));
      }
    
      return range(1, sideWidth).concat(page - leftWidth - 1, range(page - leftWidth, page + rightWidth), page - leftWidth + 3, range(totalPages - sideWidth + 1, totalPages));
    }
    
    $(function(){
      var numberOfItems = $('.table').find('tr').length;
      var limitPerPage = 10; //How many card items visible per a page
      var totalPages = Math.ceil(numberOfItems / limitPerPage);
      var paginationSize
      var currentPage;
    
      if(window.innerWidth >= 1000){
        paginationSize = 10; //How many page elements visible in the pagination for screen size grather than 1000px
      }else if(window.innerWidth >= 600){
        paginationSize = 7; //How many page elements visible in the pagination for screen size between 1000px and 600px
      }else{
        paginationSize = 5; //How many page elements visible in the pagination for screen size less than 600px
      }
    
    
      function showPage(whichPage){
        if(whichPage < 1 || whichPage > totalPages) return false;
    
        currentPage = whichPage;
    
        $(".card-content .card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
    
        $(".pagination li").slice(1, -1).remove();
    
        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
          $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
          .toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
          .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
        });
    
        $(".previous-page").toggleClass("disable", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
      }
    
      $(".pagination").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).append("<i>").addClass("fa-solid fa-angle-right")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).append("<i>").addClass("fa-solid fa-angle-left"))
      );
    
      $(".card-content").show();
      showPage(1);
    
    
      $(document).on("click", ".pagination li.current-page:not(.active)", function(){
        return showPage(+$(this).text());
      });
    
      $(".next-page").on("click", function(){
        return showPage(currentPage + 1);
      });
    
      $(".previous-page").on("click", function(){
        return showPage(currentPage - 1);
      });
    });
  }
}