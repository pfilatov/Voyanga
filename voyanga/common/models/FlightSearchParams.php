<?php
class FlightSearchParams
{
    public $routes;
    public $flight_class;
    public $adultCount;
    public $childCount;
    public $infantCount;

    public function addRoute($routeParams)
    {
        $route = new Route();
        if ($routeParams['departure_city_id'])
        {
            $route->departureCityId = $routeParams['departure_city_id'];
        }
        else
        {
            throw new CException(Yii::t('application', 'Required param departure_city_id not set'));
        }

        if ($routeParams['departure_city_id'])
        {
            $route->arrivalCityId = $routeParams['arrival_city_id'];
        }
        else
        {
            throw new CException(Yii::t('application', 'Required param arrival_city_id not set'));
        }
        if ($routeParams['departure_date'])
        {
            if (strpos($routeParams['departure_date'], '.') !== false)
            {
                list($dd, $mm, $yy) = explode('.', $routeParams['departure_date']);
            }
            elseif (strpos($routeParams['departure_date'], '-') !== false)
            {
                list($yy, $mm, $dd) = explode('.', $routeParams['departure_date']);
            }
            else
            {
                throw new CException(Yii::t('application', 'departure_date format invalid. Need dd.mm.yyyy or yyyy-mm-dd'));
            }
            if (!checkdate($mm, $dd, $yy))
            {
                throw new CException(Yii::t('application', 'departure_date parametr - date incorrect '));
            }
            if ($routeParams['adult_count'])
            {
                $route->adultCount = intval($routeParams['adult_count']);
                $this->adultCount = $route->adultCount;
            }
            if ($routeParams['child_count'])
            {
                $route->childCount = intval($routeParams['child_count']);
                $this->childCount = $route->childCount;
            }
            if ($routeParams['infant_count'])
            {
                $route->infantCount = intval($routeParams['infant_count']);
                $this->infantCount = $route->infantCount;
            }
            $route->departureDate = "{$yy}-{$mm}-{$dd}";
        }
        else
        {
            throw new CException(Yii::t('application', 'Required param departure_date not set'));
        }
        if (($route->adultCount + $route->childCount) <= 0)
        {
            throw new CException(Yii::t('application', 'Passengers count must be more then zero'));
        }
        if (($route->adultCount + $route->childCount) < $route->infantCount)
        {
            throw new CException(Yii::t('application', 'Infants count must be equal or less then (adult + child) count'));
        }
        $this->routes[] = $route;
    }

    public function __get($name)
    {
        if ($name === 'key')
        {
            $attributes = array();
            foreach ($this->routes as $route)
            {
                $attributes[] = $route->attributes;
            }

            $sKey = $this->flight_class . json_encode($attributes);
            return md5($sKey);
        }
        else
        {
            return $this->$name;
        }
    }

    public function checkValid()
    {
        $bValid = true;
        if (!$this->flight_class)
        {
            $bValid = false;
        }
        if (count($this->routes) <= 0)
        {
            $bValid = false;
        }
        return $bValid;
    }
}