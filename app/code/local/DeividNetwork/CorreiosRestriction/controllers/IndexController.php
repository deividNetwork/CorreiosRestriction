<?php

    class  DeividNetwork_CorreiosRestriction_IndexController extends Mage_Core_Controller_Front_Action {
        public function responseAction() {
            $request = $this->getRequest();

            if ($request->isGet()) {
                $numService = $request->getParam('service');
                $cepOrigin = $request->getParam('origin');
                $cepDestiny = $request->getParam('destiny');

                $webService = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrazoRestricao?';
                $webService .= 'nCdEmpresa=15103420';
                $webService .= '&sDsSenha=21913764';
                $webService .= '&nCdServico=' . $numService;
                $webService .= '&sCepOrigem=' . $cepOrigin;
                $webService .= '&sCepDestino=' . $cepDestiny;
                $webService .= '&sDtCalculo=';

                $apiResponse = file_get_contents($webService);

                $this->getResponse()
                     ->clearHeader()
                     ->setHeader('Content-Type', 'text/xml')
                     ->setBody($apiResponse);
            }
        }
    }