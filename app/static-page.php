<?php

    $SITE_ROOT = "https://memorable.io/";
    // $id = $_GET['id'];

    $id = $_GET['id'];

    // $id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    $data = file_get_contents ($SITE_ROOT . 'Row1data.json');
    $json = json_decode($data, true);
    // echo $id;

    function getObject($_id, $_json){
      $compt = 0;
      foreach($_json as $item){
         $uniqueId = $item["establishement_name_id"]; //etc
         if($uniqueId == $_id){
          //  echo $compt;
           return $compt;
         }
         $compt = $compt + 1;
      }
    }

    $id = getObject($id,$json);
    echo $id;

    makePage($json, $id, $SITE_ROOT);
    // echo $json[$id][establishement_name];

    function makePage($json, $id, $siteRoot) {

      $imageUrl = $siteRoot . "images/" . $json[$id][establishement_name_id] . ".jpg" ;
      $pageUrl = $siteRoot . "detail/" . $json[$id][establishement_name_id];

        ?>
        <!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="content-type" content="text/html; charset=utf-8">
                <title>Memorable: Montreal</title>
                <meta property="og:title" content="Memorable: Montreal - <?php echo $json[$id][establishement_name]; ?>" />
                <meta property="og:description" content="<?php echo $json[$id][influencer1_quote_text]; ?>" />
                <meta property="og:image" content="<?php echo $imageUrl; ?>" />
                <meta property="og:site_name" content="Memorable" />
                <meta property="og:url" content="<?php echo $pageUrl; ?>" />
                <meta property="og:type" content="article" />
                <meta property="article:author" content="https://www.facebook.com/memorablemtl" />



                <!-- etc. -->
            </head>
            <body>
                <p><?php echo $json[$id][influencer1_quote_text]; ?></p>
                <img src="<?php echo $imageUrl; ?>">
            </body>
        </html>
        <?php
    }
    ?>
