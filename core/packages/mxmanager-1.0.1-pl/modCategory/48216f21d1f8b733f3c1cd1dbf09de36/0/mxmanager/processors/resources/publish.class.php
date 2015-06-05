<?php

require MODX_CORE_PATH . 'model/modx/processors/resource/publish.class.php';

class mxResourcePublishProcessor extends modResourcePublishProcessor {

	/**
	 * @return array|string
	 */
	public function process() {
		$result = parent::process();
		if (empty($result['success'])) {
			return $result;
		}

		return $this->cleanup();
	}

	public function cleanup() {
		$get = require 'getrow.class.php';
		/** @var mxResourceGetRowProcessor $processor */
		$processor = new $get($this->modx, array(
			'id' => $this->resource->get('id')
		));
		$processor->initialize();

		return $processor->process();
	}

}

return 'mxResourcePublishProcessor';